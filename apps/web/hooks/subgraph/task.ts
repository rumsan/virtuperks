import { useGraphService } from "@/providers/subgraph-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useReadRewardManagementGetOpenTasks,
  useReadRewardManagementGetTask,
  useReadRewardManagementGetTaskVerifiedParticipants,
  useReadRewardManagementIsTaskExpired,
  useWriteRewardManagementCloseExpiredTasks,
  useWriteRewardManagementCloseTask,
  useWriteRewardManagementCreateTask,
} from "../wagmi/contracts";

export const useTaskAdd = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteRewardManagementCreateTask();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const verifiedParticipants = data.verifiedParticipants || [];
      const result = await writeContractAsync({
        address: data.entityAddress as `0x${string}`,
        args: [
          data.taskId,
          {
            name: data.name as string,
            detailsUrl: data.detailsUrl as string,
            owner: data.owner as `0x${string}`,
            expiryDate: BigInt(data.expiryDate),
            rewardToken: data.rewardToken as `0x${string}`,
            totalRewardAmount: BigInt(data.totalRewardAmount),
            isOpen: Boolean(data.isOpen),
            requireApproval: Boolean(data.requireApproval),
            isWhitelisted: Boolean(data.isWhitelisted),
            isTokenDisbursed: Boolean(data.isTokenDisbursed),
            maxParticipants: BigInt(data.maxParticipants),
            acceptedParticipantCount: BigInt(data.acceptedParticipantCount),
            verifiedParticipants:
              verifiedParticipants as readonly `0x${string}`[],
          },
          data.whitelistedParticipants,
        ],
      });
    },
    onSuccess: async (resultObj) => {
      await new Promise((resolve) => setTimeout(resolve, 9000));
      await queryClient.invalidateQueries({
        queryKey: ["taskList"],
      });
    },
  });
  return {
    taskAdd: mutation.mutateAsync,
    taskPending: mutation.isPending,
    taskSuccess: mutation.isSuccess,
  };
};

export const useGetAllTask = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["taskList"],
    queryFn: async () => {
      const taskDetail = await queryService?.getAllTasks();
      return taskDetail;
    },
    enabled: !!queryService,
  });
};

export const useOpenTask = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["openTasks"],
    queryFn: async () => {
      const taskDetail = await queryService?.getOpenTasks();
      return taskDetail;
    },
    enabled: !!queryService,
  });
};

export const useClosedTask = () => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["closedTasks"],
    queryFn: async () => {
      const taskDetail = await queryService?.getCloseTasks();
      return taskDetail;
    },
    enabled: !!queryService,
  });
};

export const useCloseExpiredTask = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteRewardManagementCloseExpiredTasks();

  const mutation = useMutation({
    mutationFn: async (data: { entityAddress: `0x${string}` }) => {
      return await writeContractAsync({
        address: data.entityAddress,
        args: [],
      });
    },
    onSuccess: async () => {
      // wait a bit to ensure tx is mined & indexers (like TheGraph) update
      await new Promise((resolve) => setTimeout(resolve, 9000));

      // refresh task list queries after closing
      await queryClient.invalidateQueries({
        queryKey: ["taskList"],
      });
    },
  });

  return {
    taskCloseExpired: mutation.mutateAsync,
    taskPending: mutation.isPending,
    taskSuccess: mutation.isSuccess,
  };
};

export const useGetTaskById = (id: string) => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["taskById", id],
    queryFn: async () => {
      if (!queryService) {
        throw new Error("Subgraph query service is not initialized.");
      }
      const taskDetail = await queryService?.getTaskById(id);
      return taskDetail;
    },
    enabled: !!id && !!queryService,
  });
};

export const useCloseTaskMutation = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync, isPending, isSuccess } =
    useWriteRewardManagementCloseTask();

  return useMutation({
    mutationFn: async ({
      taskId,
      entityId,
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
  });
};

// to check wheter the task is expired or not

export const useCheckTaskVerifiedParticipant = (
  taskId: string,
  entityId: string,
) => {
  const { data, isError, isLoading } =
    useReadRewardManagementGetTaskVerifiedParticipants({
      address: entityId as `0x${string}`,
      args: [taskId as `0x${string}`],
    });
  return {
    verifiedTaskParticipant: data,
    isError,
    statusLoading: isLoading,
  };
};

export const useCheckTaskStatus = (taskId: string, entityId: string) => {
  const { data, isError, isLoading } = useReadRewardManagementGetTask({
    address: entityId as `0x${string}`,
    args: [taskId as `0x${string}`],
  });

  return {
    taskDetail: data,
    status: data?.isTokenDisbursed,
    isError,
    statusLoading: isLoading,
  };
};

export const useIsTaskExpired = (taskId: string, entityId: string) => {
  const {
    data: status,
    isError,
    isLoading,
  } = useReadRewardManagementIsTaskExpired({
    address: entityId as `0x${string}`,
    args: [taskId as `0x${string}`],
  });

  return {
    status,
    isError,
    statusLoading: isLoading,
  };
};

export const useGetOpentask = (entityId: string) => {
  const { data, isError, isLoading } = useReadRewardManagementGetOpenTasks({
    address: entityId as `0x${string}`,
    args: [],
  });

  return {
    openTasks: data,
    isError,
    statusLoading: isLoading,
  };
};

export const useGetTasksOwnedByIndividual = (
  createdBy: string,
  skip: boolean = false,
) => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["tasksOwned", createdBy],
    queryFn: async () => {
      if (!queryService) {
        throw new Error("Query service is not initialized");
      }
      return await queryService.getTasksOwnedByIndividual(createdBy);
    },
    enabled: !!createdBy && !skip,
  });
};
