import { useMutation } from "@tanstack/react-query";
import { useWriteRewardManagementDisburseTokensToTask, useWriteRewardManagementTransferToken } from "../wagmi/contracts";


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


export const useDirectTokenTransfer = () => {
  const { writeContractAsync } = useWriteRewardManagementTransferToken()

  const tokenAddress = process.env.NEXT_PUBLIC_RAHAT_TOKEN

 const mutation = useMutation({
    mutationFn: async ({
      to,
        amount,
      remarks,
     entityId
    }: {
      to: string;
            amount: number;
        remarks: string;
      entityId: string;
    }) => {
      const result = await writeContractAsync({
        address: entityId as `0x${string}`,
        args: [tokenAddress as `0x${string}`, to as `0x${string}`, BigInt(amount), remarks],
      });
      return result;
    },
  });

  return {
    directTransfer: mutation.mutateAsync,
     directTransferPending: mutation.isPending,
     directTransferSuccess: mutation.isSuccess,
     directTransferError: mutation.isError,
  };
};





