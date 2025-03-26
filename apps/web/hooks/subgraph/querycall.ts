import { useGraphService } from "@/providers/subgraph-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EntityTaskManagementABI } from "@workspace/contracts/abis";

import { useReadContract } from "wagmi";
import { useWriteEntityTaskManagerAcceptParticipant, useWriteEntityTaskManagerVerifyCompletion } from "../wagmi/contracts";

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

export const useGetApprovedAndCompletedList = (taskId: any) => {
  const { queryService } = useGraphService();
  const { data, isLoading } = useQuery({
    queryKey: ["approvedAndCompleted"],
    queryFn: async () => {
      const getAllData = await queryService?.getTaskApprovedAndCompletedList(taskId);
      return getAllData;
    },
  });

  const filterData = data?.data || {taskCompleteds: [], taskApproveds: []};

  return {
    approvedData: filterData.taskApproveds || [],
    completedData: filterData.taskCompleteds || [],
    approvedAndCompletedLoading: isLoading
  };
}

export const useApproveTaskMutation = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteEntityTaskManagerVerifyCompletion()

  return useMutation({
    mutationFn: async ({ taskId, entityId }: { taskId: string; entityId: string }) => {
      const result = await writeContractAsync({
        address: (entityId as `0x${string}`) || "0x",
        args: [taskId as `0x${string}`],
      });
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["approvedAndCompleted"] });
    },
  });
};


export const useAcceptParticipantMutation = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteEntityTaskManagerAcceptParticipant();

  return useMutation({
    mutationFn: async ({ 
      taskId, 
      participant, 
      entityId 
    }: { 
      taskId: string; 
      participant: string;
      entityId: string;
    }) => {
      const result = await writeContractAsync({
        address: (entityId as `0x${string}`) || "0x",
        args: [taskId as `0x${string}`, participant as `0x${string}`],
      });
      return result;
    },
    onSuccess: () => {
      // Invalidate both participant and task status queries
      queryClient.invalidateQueries({ queryKey: ["approvedAndCompleted"] });
    },
  });
};