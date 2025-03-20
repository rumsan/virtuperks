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
      const getAllData = await queryService?.getEntityManagerCreatedList();

      return getAllData;
    },
  });
};

export const useTaskList = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const getAllData = await queryService?.getTaskCreatedList();
      return getAllData;
    },
  });
};

export const useGetAllowedWallets = (
  entityId: string,
  entityAddress: string,
) => {
  return useReadContract({
    abi: EntityTaskManagementABI,
    address: entityAddress as `0x${string}`,

    functionName: "getAllowedWallets",

    args: [entityId],
  });
};

export const useGetParticipantApplied = (taskId: any) => {
  const { queryService } = useGraphService();
  const { data, isLoading } = useQuery({
    queryKey: ["participant"],
    queryFn: async () => {
      const getAllData = await queryService?.getParticiantAppliedList();
      return getAllData;
    },
  });

  const filterData = data?.data?.particiantApplieds.filter(
    (data: any) => data?.taskDetail.id === taskId.id
  ) || [];

  return {
    participantDatas: filterData,
    isLoading
  };
};

export const useGetAcceptedList = (taskId: any) => {
  const { queryService } = useGraphService();
  const { data, isLoading } = useQuery({
    queryKey: ["accepted"],
    queryFn: async () => {
      const getAllData = await queryService?.getTaskAcceptedList();
      return getAllData;
    },
  });


  const filterData = data?.data?.taskAccepteds.filter(
    (data: any) => data?.taskDetail.id === taskId?.id
  ) || [];

  return {
    acceptedParticipant: filterData,
    acceptedLoading: isLoading
  };
};

export const useGetTaskCompletedList = (taskId:any) => {
  const { queryService } = useGraphService();
  const {data, isLoading} =  useQuery({
    queryKey: ["completed"],
    queryFn: async () => {
      const getAllData = await queryService?.getTaskCompletedList();
      return getAllData;
    },
  });
  const filterData = data?.data?.taskCompleteds.filter(
    (data: any) => data?.taskDetail.id === taskId?.id
  ) || [];

  return {
    completedData: filterData,
    completedLoading: isLoading
  }
};
