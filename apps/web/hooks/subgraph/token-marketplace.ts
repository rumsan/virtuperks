import { useGraphService } from "@/providers/subgraph-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useWriteRewardRedemptinFactoryCreateRewardRedemption,
  useWriteRewardRedemptionRedeem,
  useWriteRewardTokenApprove,
} from "../wagmi/contracts";

export const useCreateReward = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } =
    useWriteRewardRedemptinFactoryCreateRewardRedemption();
  const appId = (process.env.NEXT_PUBLIC_APP_ID as `0x${string}`) || "0x";
  const registry = process.env.NEXT_PUBLIC_APPREGISTRY as `0x${string}`;
  const token = process.env.NEXT_PUBLIC_RAHAT_TOKEN as `0x${string}`;

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const result = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_REDEMPTION_FACTORY as `0x${string}`,
        args: [appId, registry, token, data.name, BigInt(data.amount)],
      });
      return result;
    },
    onSuccess: (result, variable) => {
      // queryClient.invalidateQueries(["rewardRedemptionList"]);
    },
  });

  return {
    AddReward: mutation.mutateAsync,
    rewardPending: mutation.isPending,
    rewardSuccess: mutation.isSuccess,
  };
};

export const useGetRewards = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["rewardsList"],
    queryFn: async () => {
      const rewards = await queryService?.getRewards();
      return rewards;
    },
  });
};

export const useGetRedeemedReward = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["redeemedRewardsList"],
    queryFn: async () => {
      const rewards = await queryService?.getRedeemedReward();
      return rewards;
    },
  });
};

export const useRedeemReward = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteRewardRedemptionRedeem();

  const mutation = useMutation({
    mutationFn: async ({
      rewardAddress,
      amount,
    }: {
      rewardAddress: string;
      amount: number;
    }) => {
      const result = await writeContractAsync({
        address: rewardAddress as `0x${string}`,
        args: [],
      });
      return result;
    },
    onSuccess: (result, variable) => {
      // queryClient.invalidateQueries(["rewardRedemptionList"]);
    },
  });

  return {
    RewardRedeem: mutation.mutateAsync,
    RedeemPending: mutation.isPending,
    RedeemSuccess: mutation.isSuccess,
  };
};

export const useApproveReward = () => {
  const rewardToken = process.env.NEXT_PUBLIC_RAHAT_TOKEN as `0x${string}`;

  const { writeContractAsync } = useWriteRewardTokenApprove();
  const mutation = useMutation({
    mutationFn: async ({
      rewardAddress,
      value,
    }: {
      rewardAddress: string;
      value: number;
    }) => {
      const result = await writeContractAsync({
        address: rewardToken,
        args: [rewardAddress as `0x${string}`, BigInt(value)],
      });
      return result;
    },
    onSuccess: (result, variable) => {},
  });
  return {
    ApproveReward: mutation.mutateAsync,
    ApprovePending: mutation.isPending,
    ApproveSuccess: mutation.isSuccess,
  };
};
