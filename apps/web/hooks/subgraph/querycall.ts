import { useGraphService } from "@/providers/subgraph-provider";
import { useQuery } from "@tanstack/react-query";
import { EntityTaskManagementABI } from "@workspace/contracts/abis";

import { useReadContract } from "wagmi";

// Add these query key constants
export const QUERY_KEYS = {
  PARTICIPANT: "participant",
  ACCEPTED: "accepted",
  COMPLETED: "completed",
  TASKS: "tasks"
} as const;

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
    queryKey: [QUERY_KEYS.TASKS],
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
    queryKey: [QUERY_KEYS.PARTICIPANT],
    queryFn: async () => {
      const getAllData = await queryService?.getParticiantAppliedList();
      return getAllData;
    },
  });



  const filterData = data?.data?.particiantApplieds?.filter((data: any) => {
 
    return data?.taskDetail?.id === taskId?.id;
  }) || [];

  

  return {
    participantDatas: filterData,
    isLoading,
    // Return raw data for debugging
    rawData: data?.data?.particiantApplieds
  };
};

export const usegetSingTask = (taskId:any) => {
  const { queryService } = useGraphService();


 const {data, isLoading}=  useQuery({
    queryKey: ["singleTask"],
    queryFn: async () => {
      const getAllData = await queryService?.getTaskCreatedList();
      return getAllData;
    },
 });

  const filterData = data?.data?.taskCreateds.find(
    (data: any) => data?.id === taskId.id
  ) || [];
  return {
    taskData: filterData,
    taskLoading: isLoading
  }
};

export const useGetAcceptedList = (taskId: any) => {
  const { queryService } = useGraphService();
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ACCEPTED],
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
    queryKey: [QUERY_KEYS.COMPLETED],
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

export const useGetApprovedList = (taskId: any) => {
  
  const { queryService } = useGraphService();
  const { data, isLoading } = useQuery({
    queryKey: ["approved"],
    queryFn: async () => {
      const getAllData = await queryService?.getTaskApproveddList()
      return getAllData;
    },
  });



  const filterData = data?.data?.taskApproveds.filter(
    (data: any) => data?.taskDetail.id === taskId?.id
  ) || [];
 

  return {
    approvedData: filterData,
    approvedLoading: isLoading
  };
}

export const useGetParticipantTaskStatus = (participant: any, taskId: any) => {
  const { queryService } = useGraphService();
  const { data, isLoading } = useQuery({
    queryKey: ["participantTaskStatus"],
    queryFn: async () => {
      const getAllData = await queryService?.getParticipantTaskStatus(participant, taskId);
     return getAllData
    },
  });


  const filterData = data?.data?.participantTaskStatuses || [];

  return {
    participantTaskStatus: filterData,
    participantTaskStatusLoading: isLoading
  };
}

export const useGetTaskParticipantsWithStatus = (taskId: any) => {

  const { queryService } = useGraphService();
  const { data, isLoading } = useQuery({
    queryKey: ["taskParticipantsWithStatus"],
    queryFn: async () => {
      const getAllData = await queryService?.getTaskParticipantsWithStatus(taskId);
      return getAllData;
    },
  });

  const filterData = data?.data?.participantTaskStatuses || [];

  return {
    taskParticipantsWithStatus: filterData,
    taskParticipantsWithStatusLoading: isLoading
  };
}