"use client";

import { DialogButton } from "@/components/common/ui/dialog";
import { useCheckTotalUnallocatedTokens } from "@/hooks/subgraph/entity";
import { useTaskAdd } from "@/hooks/subgraph/task";
import { PATHS } from "@/routes/paths";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { Card, CardContent } from "@workspace/ui/components/card";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { toUtf8Bytes } from "ethers";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { isAddress, keccak256 } from "viem";
import { TaskFormData, taskSchema } from "./schema";
import TaskBaseForm from "./task.form";

const defaultValues = {
  name: "",
  detailsUrl: "",
  owner: "",
  entityAddress: "",
  expiryDate: new Date(),
  rewardToken: process.env.NEXT_PUBLIC_RAHAT_TOKEN || "",
  totalRewardAmount: "",
  isOpen: true,
  isTokenDisbursed: false,
  requireApproval: true,
  isWhitelisted: true,
  maxParticipants: 0,
  whitelistedParticipants: [],
};

type TaskAddProps = {
  router: AppRouterInstance;
};

export default function TaskAdd({ router }: TaskAddProps) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema()),
    defaultValues,
  });

  const { toast } = useToast();

  const [entityId, setEntityId] = useState("");
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [insufficientTokenDialog, setInsufficientTokenDialog] = useState(false);

  const { unallocatedTokens } = useCheckTotalUnallocatedTokens(entityId);
  const { taskAdd, taskPending } = useTaskAdd();

  // Watch for changes to entityAddress
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "entityAddress") {
        const address = value.entityAddress || "";
        if (isAddress(address)) {
          setIsCheckingBalance(true);
          setEntityId(address);
        } else {
          setEntityId("");
          setShowTokenDialog(false);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Show dialog if tokens are not minted
  useEffect(() => {
    if (!entityId) {
      setShowTokenDialog(false);
      setIsCheckingBalance(false);
      return;
    }

    if (unallocatedTokens !== undefined) {
      setShowTokenDialog(unallocatedTokens === BigInt(0));
      setIsCheckingBalance(false);
    }
  }, [unallocatedTokens, entityId]);

  const createTask = async (data: TaskFormData) => {
    const address = data.entityAddress;

    if (!isAddress(address)) {
      toast({
        title: "Invalid Address",
        description: "Please provide a valid Ethereum address",
        variant: "destructive",
      });
      return;
    }

    const totalRewardAmount = BigInt(data.totalRewardAmount);
    const tokenBalance = unallocatedTokens ?? BigInt(0);

    if (tokenBalance < totalRewardAmount) {
      setInsufficientTokenDialog(true);
      return;
    }

    try {
      const cuid = createId();
      const taskId = keccak256(toUtf8Bytes(cuid));

      const {
        detailsUrl,
        rewardToken,
        owner,
        isOpen,
        name,
        isTokenDisbursed,
        requireApproval,
        isWhitelisted,
        maxParticipants,
        whitelistedParticipants,
        expiryDate,
      } = data;

      await taskAdd({
        taskId,
        name,
        detailsUrl,
        owner,
        entityAddress: address,
        expiryDate: BigInt(Math.floor(new Date(expiryDate).getTime() / 1000)),
        rewardToken,
        totalRewardAmount: totalRewardAmount.toString(),
        isOpen,
        isTokenDisbursed,
        requireApproval,
        isWhitelisted,
        maxParticipants: BigInt(maxParticipants).toString(),
        acceptedParticipantCount: 0,
        whitelistedParticipants: Array.isArray(whitelistedParticipants)
          ? whitelistedParticipants
          : [whitelistedParticipants],
        verfiedParticipants: [],
      });

      toast({
        title: "Task Created Successfully!",
        variant: "success",
      });

      router.push(PATHS.TASKS.HOME);
    } catch (err) {
      console.error("Failed to create task:", err);
      toast({
        title: "Task Creation Failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full items-center">
      <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full">
        <div
          onClick={() => router.push(PATHS.TASKS.HOME)}
          className="flex items-center gap-2 cursor-pointer hover:text-gray-400 my-3"
        >
          <ArrowLeft size={24} strokeWidth={2} />
          <span className="font-base text-gray-700">Back</span>
        </div>

        <div className="flex flex-col gap-1 my-2">
          <h1 className="font-bold text-4xl">Create Task</h1>
          <h3 className="text-gray-500 font-normal text-sm">
            Fill the form below to create a new task
          </h3>
        </div>

        <div className="my-6">
          {isCheckingBalance ? (
            <Card className="rounded-lg w-full p-8 flex justify-center">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking token balance...</span>
              </div>
            </Card>
          ) : showTokenDialog ? (
            <DialogButton
              isOpen={showTokenDialog}
              setIsOpen={setShowTokenDialog}
              title="No Tokens Available"
              subTitle="This entity does not have any tokens minted. Please mint tokens before creating a task."
              buttonName="Close"
            />
          ) : (
            <Card className="rounded-lg w-full">
              <CardContent className="p-0">
                <TaskBaseForm
                  mode="add"
                  form={form}
                  defaultValues={defaultValues}
                  saveForm={createTask}
                  isPending={taskPending}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Dialog for insufficient token balance */}
        {insufficientTokenDialog && (
          <DialogButton
            isOpen={insufficientTokenDialog}
            setIsOpen={setInsufficientTokenDialog}
            title="Insufficient Tokens"
            subTitle="The entity does not have enough tokens to fulfill the total reward. Please mint more tokens or lower the reward amount."
            buttonName="Cancel Task Creation"
          />
        )}
      </main>
    </div>
  );
}
