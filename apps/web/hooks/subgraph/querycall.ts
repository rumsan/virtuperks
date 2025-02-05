import { useGraphService } from "@/provider/subgraph-provider";
import { useQuery } from "@tanstack/react-query";

export const useEntity = () => {
  const { queryService } = useGraphService();
  console.log(queryService, "queryService");

  return useQuery({
    queryKey: ["entity"],
    queryFn: async () => {
      const getAllData = await queryService?.getAppCreatedlist();
      console.log(getAllData, "getAllData form querycallts");
      return getAllData || { data: null };
    },
  });
};
