import { useGraphService } from "@/providers/subgraph-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EntityTaskManagementABI } from "@workspace/contracts/abis";

import { useAccount, useReadContract } from "wagmi";
import {
  useWriteEntityTaskManagerAcceptParticipant,
  useWriteEntityTaskManagerCompleteTask,
  useWriteEntityTaskManagerParticipate,
  useWriteEntityTaskManagerVerifyCompletion
} from "../wagmi/contracts";

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
 export const useEntityDetailById = (id: string) => {
  const { queryService } = useGraphService();
  return useQuery({
    queryKey: ["entityDetail", id],
    queryFn: async () => {
      const getAllData = await queryService?.getEntityDetailById(id);
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






export const useGetParticipantTaskStatus = (participant: any, taskId: any) => {

  const { queryService } = useGraphService();
  const { data, isLoading } = useQuery({
    queryKey: ["participantTaskStatus",participant,taskId],
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
    queryKey: ["taskParticipantsWithStatus",taskId],
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
    queryKey: ["approvedAndCompleted", taskId],
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
    onSuccess: async (variable) => {
    console.log(variable,'from appove function')
      // Invalidate and refetch
      await new Promise((resolve) => setTimeout(resolve, 9000));
    
      queryClient.invalidateQueries({ queryKey: ["approvedAndCompleted"] });
    },
  });
};


export const useAcceptParticipantMutation = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync , isPending, isSuccess} = useWriteEntityTaskManagerAcceptParticipant();

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
     
  
      return  result
    },
 
    onSuccess: async (result, variable) => {
  
    
  await new Promise((resolve) => setTimeout(resolve, 9000));
      await queryClient.invalidateQueries({
        queryKey: ["taskParticipantsWithStatus", variable.taskId],
      });
    },
  });
};
const participateInTask = async (
  writeContractAsync: (config: any) => Promise<any>,
  taskId: string,
  entityId: string
) => {
  const result = await writeContractAsync({
    address: entityId as `0x${string}`,
    args: [taskId as `0x${string}`],
  });
  return result;
};

export const  useParticipateTaskMutation = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteEntityTaskManagerParticipate();
  const  {address:participant} = useAccount()

  const mutation =  useMutation({
    mutationFn: async ({ 
      taskId, 
      entityId 
    }: { 
      taskId: string; 
      entityId: string;
    }) => {
      const result = await writeContractAsync({
        address: (entityId as `0x${string}`) || "0x",
        args: [taskId as `0x${string}`],
      });
      return result;
    },
    onSuccess: (result, variable) => {
     
      if (participant) {
    setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ["participantTaskStatus", participant, variable.taskId],
          });
          
        }, 5000);
      }
    },
  });
  return {
    participateTask: mutation.mutateAsync,
    participatePending: mutation.isPending,
    participateSuccess: mutation.isSuccess,
    
  }
}



export const useCompleteTaskMutation = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteEntityTaskManagerCompleteTask();
    const  {address:participant} = useAccount()

  const mutation = useMutation({
    mutationFn: async ({ 
      taskId, 
      entityId 
    }: { 
      taskId: string; 
      entityId: string;
    }) => {
      const result = await writeContractAsync({
        address: (entityId as `0x${string}`) || "0x",
        args: [taskId as `0x${string}`],
      });
      return result;
    },
    onSuccess: (result, variable) => {
     
         if (participant) {
    setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ["participantTaskStatus", participant, variable.taskId],
          });
          
        }, 5000);
      }
    },
  });
  return {
    completeTask: mutation.mutateAsync,
    completePending: mutation.isPending,
    completeSuccess: mutation.isSuccess,
 }
}