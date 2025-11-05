import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useGraphService } from "@/providers/subgraph-provider";
import { useAccount } from "wagmi";
import {
  useReadRewardManagementGetParticipantStatus,
  useWriteRewardManagementAcceptParticipant,
  useWriteRewardManagementCompleteTask,
  useWriteRewardManagementParticipate,
  useWriteRewardManagementRejectParticipant,
  useWriteRewardManagementVerifyTask,
} from "../wagmi/contracts";

export const useCheckParticipantStatus = (taskId: string, entityId: string) => {
  const { address } = useAccount();
  const {
    data: status,
    isError,
    isLoading,
  } = useReadRewardManagementGetParticipantStatus({
    address: entityId as `0x${string}`,
    args: [taskId as `0x${string}`, address as `0x${string}`],
  });

  return {
    status,
    isError,
    isLoading,
  };
};

export const useParticipateTaskMutation = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteRewardManagementParticipate();
  const { address: participant } = useAccount();

  const mutation = useMutation({
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
  };
};

export const useCompleteTaskMutation = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteRewardManagementCompleteTask();
  const { address: participant } = useAccount();

  const mutation = useMutation({
    mutationFn: async ({
      taskId,
      entityId,
      completionUrl,
    }: {
      taskId: string;
      entityId: string;
      completionUrl?: string;
    }) => {
      const result = await writeContractAsync({
        address: (entityId as `0x${string}`) || "0x",
        args: [taskId as `0x${string}`, completionUrl || ""],
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
  };
};

export const useAcceptParticipantMutation = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync, isPending, isSuccess } =
    useWriteRewardManagementAcceptParticipant();

  return useMutation({
    mutationFn: async ({
      taskId,
      participant,
      entityId,
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

    onSuccess: async (result, variable) => {
      await new Promise((resolve) => setTimeout(resolve, 9000));
      await queryClient.invalidateQueries({
        queryKey: ["AllParticipantsStatus", variable.taskId],
      });
    },
  });
};

export const useGetCombineStausByTask = (taskId: any) => {
  const { queryService } = useGraphService();

  const { data, isLoading } = useQuery({
    queryKey: ["AllParticipantsStatus", taskId],
    queryFn: async () => {
      const getAllData =
        await queryService?.getCombineParticipantsByTask(taskId);
      return getAllData;
    },
    enabled: !!taskId,
  });

  //  const filterData = data?.data?.participantTaskStatuses || [];

  return {
    pendingParticipants: data?.data?.pendingParticipants || [],
    acceptedParticipants: data?.data?.acceptedParticipants || [],
    completedParticipants: data?.data?.completedParticipants || [],
    verifiedPartcipants: data?.data?.verifiedParticipants || [],
    rejectedParticipants: data?.data?.rejectedParticipants || [],
    combineParticipantsLoading: isLoading,
  };
};

export const useVerifyParticipantMutation = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync, isPending, isSuccess } =
    useWriteRewardManagementVerifyTask();

  return useMutation({
    mutationFn: async ({
      taskId,
      participant,
      entityId,
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

    onSuccess: async (result, variable) => {
      await new Promise((resolve) => setTimeout(resolve, 9000));
      await queryClient.invalidateQueries({
        queryKey: ["AllParticipantsStatus", variable.taskId],
      });
    },
  });
};

export const useRejectParticipantMutation = () => {
  const queryClient = useQueryClient();
  const { writeContractAsync, isPending, isSuccess } =
    useWriteRewardManagementRejectParticipant();

  return useMutation({
    mutationFn: async ({
      taskId,
      participant,
      entityId,
      remark,
    }: {
      taskId: string;
      participant: string;
      entityId: string;
      remark: string;
    }) => {
      console.log(remark, "remark---");
      // const result = await writeContractAsync({
      //   address: (entityId as `0x${string}`) || "0x",
      //   args: [taskId as `0x${string}`, participant as `0x${string}`, remark],
      // });

      // return result;
    },

    onSuccess: async (result, variable) => {
      await new Promise((resolve) => setTimeout(resolve, 9000));
      await queryClient.invalidateQueries({
        queryKey: ["AllParticipantsStatus", variable.taskId],
      });
    },
  });
};
