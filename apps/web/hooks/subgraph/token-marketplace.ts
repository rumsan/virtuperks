import { useRemoteClient } from "@/utils/api.utils";
import { useQuery } from "@tanstack/react-query";

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
