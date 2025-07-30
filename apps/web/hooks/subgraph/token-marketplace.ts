import { useGraphService } from "@/providers/subgraph-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useWriteRewardRedemptinFactoryCreateRewardRedemption,
  useWriteRewardRedemptionRedeem,
  useWriteRewardRedemptionUpdateRedemptionStatus,
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
    mutationFn: async (data: {
      rewardId: string;
      name: string;
      amount: number;
      category: string;
      owner: string;
    }) => {
      const result = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_REDEMPTION_FACTORY as `0x${string}`,
        args: [
          data.rewardId as `0x${string}`,
          appId,
          registry,
          token,
          data.name,
          BigInt(data.amount),
          data.category as `0x${string}`,
          data.owner as `0x${string}`,
        ],
      });
      return result;
    },

    onSuccess: async () => {
      await new Promise((resolve) => setTimeout(resolve, 9000));
      await queryClient.invalidateQueries({
        queryKey: ["rewardsList"],
      });
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

export const useGetRewardById = (id: string) => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["rewardById", id],
    queryFn: async () => {
      if (!queryService) {
        throw new Error("Subgraph query service is not initialized.");
      }
      const rewardDetail = await queryService.getRewardById(id);
      return rewardDetail;
    },
    enabled: !!id && !!queryService,
  });
};

export const useGetRedeemedReward = (rewardRedemption: string) => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["redeemedRewardsList"],
    queryFn: async () => {
      const rewards = await queryService?.getRedeemedReward(rewardRedemption);
      return rewards;
    },
  });
};

export const useRedeemReward = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteRewardRedemptionRedeem();

  const mutation = useMutation({
    mutationFn: async ({ rewardAddress }: { rewardAddress: string }) => {
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

export const useUpdateRedemptionStatus = () => {
  const { writeContractAsync } =
    useWriteRewardRedemptionUpdateRedemptionStatus();

  const mutation = useMutation({
    mutationFn: async ({
      userAddress,
      rewardAddress,
    }: {
      userAddress: string;
      rewardAddress: string;
    }) => {
      const result = await writeContractAsync({
        address: rewardAddress as `0x${string}`,
        args: [userAddress as `0x${string}`],
      });
      return result;
    },
    onSuccess: (result, variable) => {},
  });

  return {
    UpdateRedeemStatus: mutation.mutateAsync,
    UpdateRedeemPending: mutation.isPending,
    UpdateRedeemSuccess: mutation.isSuccess,
  };
};

export const useGetRedeemedRewardByParticiant = (
  participantAddress: string,
) => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["redeemedRewardsByParticipant", participantAddress],
    queryFn: async () => {
      const rewards =
        await queryService?.getRedeemedRewardsByParticipant(participantAddress);
      return rewards;
    },
  });
};
