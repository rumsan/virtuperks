import { useRemoteClient } from "@/utils/api.utils";
import { Pagination } from "@rumsan/sdk/types";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { CreatePhone, CreateRedemption, Redemption } from "@workspace/sdk/type";

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
  pagination?: Pagination,
): UseQueryResult<
  {
    data: Redemption[] | null;
    meta: any;
  },
  Error
> => {
  const { apiClient } = useRemoteClient();

  return useQuery({
    queryKey: ["redemptionList", { ...pagination, ...filters }],
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

export const useAddUserPhone = () => {
  const { apiClient, queryClient } = useRemoteClient();

  return useMutation(
    {
      mutationFn: async (payload: CreatePhone) => {
        const { data } = await apiClient.reward.createPhone(payload);

        return data;
      },
      onSuccess: () => {
        // queryClient?.invalidateQueries({
        //   queryKey: ["account_list"],
        // });
      },
    },
    queryClient,
  );
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
        // queryClient?.invalidateQueries({
        //   queryKey: ["account_list"],
        // });
      },
    },
    queryClient,
  );
};
