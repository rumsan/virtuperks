import { useGraphService } from "@/providers/subgraph-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useWriteRewardRedemptinFactoryCreateRewardRedemption } from "../wagmi/contracts";

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
