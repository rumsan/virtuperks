import { useMutation } from "@tanstack/react-query";
import { useReadRewardManagementIsTaskExpired, useWriteRewardManagementDisburseTokensToTask } from "../wagmi/contracts";


export const useDisburseTokenToTask = () => {
  const { writeContractAsync } = useWriteRewardManagementDisburseTokensToTask()

 const mutation = useMutation({
    mutationFn: async ({
      taskId,
        amount,
      entityId,
    }: {
      taskId: string;
            amount: number;
      entityId: string;
    }) => {
      const result = await writeContractAsync({
        address: entityId as `0x${string}`,
        args: [taskId as `0x${string}`, BigInt(amount)],
      });
      return result;
    },
  });

  return {
    disburseTokenToTask: mutation.mutateAsync,
     disbursePending: mutation.isPending,
     disburseSuccess: mutation.isSuccess,
     disburseError: mutation.isError,
  };
};



