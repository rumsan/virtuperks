import { useGraphService } from "@/providers/subgraph-provider";
import { useQuery } from "@tanstack/react-query";

export const useEntity = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["entity"],
    queryFn: async () => {
      const getAllData = await queryService?.getAppCreatedlist();

      return getAllData;
    },
  });
};
