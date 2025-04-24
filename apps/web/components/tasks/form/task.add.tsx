"use client";

import { PATHS } from "@/routes/paths";
import { zodResolver } from "@hookform/resolvers/zod";
import { EntityTaskManagementABI } from "@workspace/contracts/abis";
import { Card, CardContent } from "@workspace/ui/components/card";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { isAddress } from "viem";
import { useWriteContract } from "wagmi";
import { taskSchema } from "./schema";
import TaskBaseForm from "./task.form";


const defaultValues: any = {
  taskName: "",
  detailsUrl: "",
  owner: "",
  rewardToken: process.env.NEXT_PUBLIC_RAHAT_TOKEN || "",
  expiryDate: "",
  allowedWallets: "",
  maxParticipants: 0,
  rewardAmount: 0,
  isActive: false,
  entityAddress: "",
};

type TaskAddProps = {
  router: AppRouterInstance;
};

export default function TaskAdd({ router }: TaskAddProps) {
  const form = useForm({
    resolver: zodResolver(taskSchema()),
    defaultValues: defaultValues,
  });
  const { toast } = useToast();

  const { 
    writeContractAsync, 
    isPending, 
    isSuccess, 
    isError,
    error 
  } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      router.push(PATHS.TASKPORTAL.HOME);
    }
  }, [isSuccess, router]);

  useEffect(() => {
    if (isError && error) {
      console.error('Transaction failed:', error);
    }
  }, [isError, error]);

  const createTask = async (data: any) => {
  
    if (!isAddress(data.entityAddress)) {
      console.error("Invalid Ethereum address:", data.entityAddress);
      return;
    }
    
   
    const { detailsUrl, rewardToken, owner, isActive , taskName} = data;
    const expiryDate = BigInt(Math.floor(new Date(data.expiryDate).getTime() / 1000));
    const allowedWallets = Array.isArray(data.allowedWallets) ? data.allowedWallets : [data.allowedWallets];
    const rewardAmount = BigInt(data.rewardAmount);
    const maxParticipants = BigInt(data.maxParticipants);
   

    try {

      await writeContractAsync({
        address: data.entityAddress,
        abi: EntityTaskManagementABI,
        functionName: "createTask",
        args: [{
          taskName,
          detailsUrl,
          rewardToken,
          rewardAmount,
          allowedWallets,
          maxParticipants,
          expiryDate,
          owner,
          isActive,
        }],
      });
      //add toast for success
      toast({
      variant: 'default', 
      description: 'Task created successfully',
    });

    } catch (err) {
      console.error('Failed to create task:', err);
      //add toast for error
      toast({
        variant: 'destructive',
        description: 'Failed to create task',
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
                isPending={isPending}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
