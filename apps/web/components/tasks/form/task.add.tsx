"use client";

import { usegetEntityOwner } from "@/hooks/subgraph/entity";
import { useRoleCheck } from "@/hooks/subgraph/role-check";
import { useTaskAdd } from "@/hooks/subgraph/task";
import { PATHS } from "@/routes/paths";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { Card, CardContent } from "@workspace/ui/components/card";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { toUtf8Bytes } from "ethers";
import { ArrowLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { keccak256 } from "viem";
import { TaskFormData, taskSchema } from "./schema";
import TaskBaseForm from "./task.form";

const defaultValues = {
  name: "",
  detailsUrl: "",
  owner: "",
  entityAddress: "",
  expiryDate: new Date(),
  rewardToken: process.env.NEXT_PUBLIC_RAHAT_TOKEN || "",
  totalRewardAmount: 0,
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
    mode: "onChange",
    defaultValues: defaultValues,
  });
  const { toast } = useToast();
  const [entityId, setEntityId] = useState("");

  const { getEntityOwnerRole, roleLoading, isError } =
    usegetEntityOwner(entityId);

  // Check if the connected wallet has the owner role
  const {
    roleStatus: hasOwnerRole,
    isError: roleCheckError,
    statusLoading: roleCheckLoading,
  } = useRoleCheck(getEntityOwnerRole);

  const { taskAdd, taskPending } = useTaskAdd();
  const entityAddress = form.watch("entityAddress");

  useEffect(() => {
    if (entityAddress) {
      setEntityId(entityAddress);
    }
  }, [entityAddress]);

  const createTask = async (data: any) => {
    try {
      // Check if role data is still loading
      if (roleLoading || roleCheckLoading) {
        toast({
          title: "Checking Ownership",
          description: "Verifying ownership role, please wait...",
          variant: "default",
        });
        return;
      }

      if (!hasOwnerRole) {
        toast({
          title: "Access Denied",
          description: "Access Denied. Only the owner can create tasks.",
          variant: "destructive",
        });
        return;
      }

      // Rest of your existing task creation code
      const cuid = createId();
      const taskId = keccak256(toUtf8Bytes(cuid));

      const { detailsUrl, rewardToken, owner, isOpen, name } = data;
      const expiryDate = BigInt(
        Math.floor(new Date(data.expiryDate).getTime() / 1000),
      );
      const whitelistedParticipants = Array.isArray(
        data.whitelistedParticipants,
      )
        ? data.whitelistedParticipants
        : [data.whitelistedParticipants];
      const totalRewardAmount = BigInt(data.totalRewardAmount);
      const maxParticipants = BigInt(data.maxParticipants);

      await taskAdd({
        taskId,
        name,
        detailsUrl,
        owner,
        entityAddress: data.entityAddress,
        expiryDate,
        rewardToken,
        totalRewardAmount: totalRewardAmount.toString(),
        isOpen,
        isTokenDisbursed: data.isTokenDisbursed,
        requireApproval: data.requireApproval,
        isWhitelisted: data.isWhitelisted,
        maxParticipants: maxParticipants.toString(),
        acceptedParticipantCount: 0, // Default to 0
        whitelistedParticipants: whitelistedParticipants || [],
        verfiedParticipants: [], // Default to empty array
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
        description:
          err instanceof Error ? err.message : "Unknown error occurred",
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
        </div>
      </main>
    </div>
  );
}
