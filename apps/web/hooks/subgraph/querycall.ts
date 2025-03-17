import { useGraphService } from "@/providers/subgraph-provider";
import { useQuery } from "@tanstack/react-query";
import { EntityTaskManagementABI } from "@workspace/contracts/abis";
import { useReadContract } from "wagmi";

export const useApplist = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["app"],
    queryFn: async () => {
      const getAllData = await queryService?.getAppCreatedlist();

      return getAllData;
    },
  });
};


export const useEntityList = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["entity"],
    queryFn: async () => {
      const getAllData = await queryService?.getEntityManagerCreatedList()

      return getAllData;
    },
  });
};

export const useTaskList = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const getAllData = await queryService?.getTaskCreatedList()
      return getAllData;
    },
  });
}

export const useGetAllowedWallets = (entityId: string, entityAddress:string) => { 

  return useReadContract({
     abi: EntityTaskManagementABI,
    address: entityAddress as `0x${string}`,
   
    functionName: "getAllowedWallets",
 
    args: [entityId],
   
})


}