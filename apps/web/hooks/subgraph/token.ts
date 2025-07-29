"use client";
import { useGraphService } from "@/providers/subgraph-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  useReadRewardTokenBalanceOf,
  useWriteRewardManagementDisburseTokensToTask,
  useWriteRewardManagementTransferToken,
  useWriteRewardTokenTransfer,
} from "../wagmi/contracts";

export const useDisburseTokenToTask = () => {
  const { writeContractAsync } = useWriteRewardManagementDisburseTokensToTask();

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
  const { writeContractAsync } = useWriteRewardManagementTransferToken();

  const tokenAddress = process.env.NEXT_PUBLIC_RAHAT_TOKEN;

  const mutation = useMutation({
    mutationFn: async ({
      to,
      amount,
      remarks,
      entityId,
    }: {
      to: string;
      amount: number;
      remarks: string;
      entityId: string;
    }) => {
      const result = await writeContractAsync({
        address: entityId as `0x${string}`,
        args: [
          tokenAddress as `0x${string}`,
          to as `0x${string}`,
          BigInt(amount),
          remarks,
        ],
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

//Query to get list of token i.e directly transfered and task token
export const useGetTokenTransfers = (
  rewardManagementAddress: string,
  skip: boolean = false,
) => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["tokenTransfers", rewardManagementAddress],
    enabled: !!rewardManagementAddress && !skip,
    queryFn: async () => {
      if (!queryService) {
        throw new Error("Graph service not initialized");
      }

      const { data, error } =
        await queryService.getRewardManagementTokenTransfers(
          rewardManagementAddress,
        );
      console.log("Data Transfer: ", data);

      if (error) {
        throw new Error(
          (error as Error)?.message || "Error fetching token transfers",
        );
      }

      return data;
    },
  });
};

export const useGetDisbursements = (
  rewardManagementAddress: string,
  skip: boolean = false,
) => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["disbursements", rewardManagementAddress],
    enabled: !!rewardManagementAddress && !skip,
    queryFn: async () => {
      if (!queryService) {
        throw new Error("Graph service not initialized");
      }

      const { data, error } =
        await queryService.getRewardManagementDisbursements(
          rewardManagementAddress,
        );
      console.log("Data Disbursement: ", data);

      if (error) {
        throw new Error(
          (error as Error)?.message || "Error fetching disbursements",
        );
      }

      return data;
    },
  });
};

export const useRedeemToken = () => {
  const { writeContractAsync } = useWriteRewardTokenTransfer();

  const tokenAddress = process.env.NEXT_PUBLIC_RAHAT_TOKEN;
  const adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;

  const mutation = useMutation({
    mutationFn: async ({ amount }: { amount: number }) => {
      const result = await writeContractAsync({
        address: tokenAddress as `0x${string}`,
        args: [adminAddress as `0x${string}`, BigInt(amount)],
      });
      return result;
    },
  });

  return {
    tokenRedeem: mutation.mutateAsync,
    redeemPending: mutation.isPending,
    redeemSuccess: mutation.isSuccess,
    redeemError: mutation.isError,
  };
};

export const useCheckParticipantBalance = (participantAddress: string) => {
  const tokenAddress = process.env.NEXT_PUBLIC_RAHAT_TOKEN;

  const { data, isError, isLoading } = useReadRewardTokenBalanceOf({
    address: tokenAddress as `0x${string}`,
    args: [participantAddress as `0x${string}`],
  });
  return {
    participantTotalToken: data,
    isError,
    isLoading,
  };
};
