import { useRemoteClient } from "@/utils/api.utils";

import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { CreateRedemption, Redemption } from "@workspace/sdk/type";

export const useRewardList = () => {
  const { apiClient } = useRemoteClient();

  return useQuery({
    queryKey: ["rewardList"],
    queryFn: async () => {
      const res = await apiClient.reward.list();
      return res.data;
    },
  });
};

export const useRedemptionList = (
  filters: any,
  pagination?: any,
): UseQueryResult<
  {
    data: Redemption[] | null;
    meta: any;
  },
  Error
> => {
  const { apiClient } = useRemoteClient();

  return useQuery({
    queryKey: ["redemptionList"],
    queryFn: async () => {
      const { response } = await apiClient.redemption.search(
        pagination,
        filters,
      );

      return {
        data: response.data,
        meta: response.meta,
      };
    },
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache data
  });
};

export const useGetRewardById = (cuid: string) => {
  const { apiClient } = useRemoteClient();

  return useQuery({
    queryKey: ["rewardDetail", cuid],
    queryFn: async () => {
      const res = await apiClient.reward.findOne(cuid);
      return res.data;
    },
    enabled: !!cuid,
  });
};

export const useCreateRedemption = () => {
  const { apiClient, queryClient } = useRemoteClient();

  return useMutation(
    {
      mutationFn: async (payload: CreateRedemption) => {
        const { data } = await apiClient.redemption.create(payload);

        return data;
      },
      onSuccess: () => {
        // Force immediate invalidation and refetch
        queryClient?.invalidateQueries({
          queryKey: ["redemptionList"],
          exact: true,
        });
      },
    },
    queryClient,
  );
};

export const useGetPhoneByWallet = (userWalletAddress: string) => {
  const { apiClient } = useRemoteClient();

  return useQuery({
    queryKey: ["phoneDetail", userWalletAddress],
    queryFn: async () => {
      const res = await apiClient.reward.findPhonebyWallet(userWalletAddress);
      return res.data;
    },
    enabled: !!userWalletAddress,
  });
};

export const useUpdateRedemption = () => {
  const { apiClient, queryClient } = useRemoteClient();

  return useMutation(
    {
      mutationFn: async (payload: { cuid: string; data: any }) => {
        const res = await apiClient.redemption.update(
          payload.cuid,
          payload.data,
        );
        return res.data;
      },
      onSuccess: async (response) => {
        console.log(response, "response");
        // Force immediate invalidation and refetch
        queryClient?.invalidateQueries({
          queryKey: ["redemptionList"],
        });
      },
    },
    queryClient,
  );
};
