import { useGraphService } from "@/providers/subgraph-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


import { useAccount, useReadContract } from "wagmi";
import { useWriteRewardManagementAcceptParticipant, useWriteRewardManagementParticipate } from "../wagmi/contracts";


;

// export const useGetAllowedWallets = (
//   entityId: string,
//   entityAddress: string,
// ) => {
//   return useReadContract({
//     abi: EntityTaskManagementABI,
//     address: entityAddress as `0x${string}`,

//     functionName: "getAllowedWallets",

//     args: [entityId],
//   });
// };

// export const useGetParticipantTaskStatus = (participant: any, taskId: any) => {
//   const { queryService } = useGraphService();
//   const { data, isLoading } = useQuery({
//     queryKey: ["participantTaskStatus", participant, taskId],
//     queryFn: async () => {
//       const getAllData = await queryService?.getParticipantTaskStatus(
//         participant,
//         taskId,
//       );
//       return getAllData;
//     },
//   });

//   const filterData = data?.data?.participantTaskStatuses || [];

//   return {
//     participantTaskStatus: filterData,
//     participantTaskStatusLoading: isLoading,
//   };
// };

// export const useGetTaskParticipantsWithStatus = (taskId: any) => {
//   const { queryService } = useGraphService();
//   const { data, isLoading } = useQuery({
//     queryKey: ["taskParticipantsWithStatus", taskId],
//     queryFn: async () => {
//       const getAllData =
//         await queryService?.getTaskParticipantsWithStatus(taskId);
//       return getAllData;
//     },
//   });

//   const filterData = data?.data?.participantTaskStatuses || [];

//   return {
//     taskParticipantsWithStatus: filterData,
//     taskParticipantsWithStatusLoading: isLoading,
//   };
// };

// export const useGetApprovedAndCompletedList = (taskId: any) => {
//   const { queryService } = useGraphService();
//   const { data, isLoading } = useQuery({
//     queryKey: ["approvedAndCompleted", taskId],
//     queryFn: async () => {
//       const getAllData =
//         await queryService?.getTaskApprovedAndCompletedList(taskId);
//       return getAllData;
//     },
//   });

//   const filterData = data?.data || { taskCompleteds: [], taskApproveds: [] };

//   return {
//     approvedData: filterData.taskApproveds || [],
//     completedData: filterData.taskCompleteds || [],
//     approvedAndCompletedLoading: isLoading,
//   };
// };

// export const useApproveTaskMutation = () => {
//   const queryClient = useQueryClient();
//   const { writeContractAsync } = useWriteEntityTaskManagerVerifyCompletion();

//   return useMutation({
//     mutationFn: async ({
//       taskId,
//       entityId,
//     }: {
//       taskId: string;
//       entityId: string;
//     }) => {
//       const result = await writeContractAsync({
//         address: (entityId as `0x${string}`) || "0x",
//         args: [taskId as `0x${string}`],
//       });
//       return result;
//     },
//     onSuccess: async (variable) => {
//       // Invalidate and refetch
//       await new Promise((resolve) => setTimeout(resolve, 9000));

//       queryClient.invalidateQueries({ queryKey: ["approvedAndCompleted"] });
//     },
//   });
// };

// export const useAcceptParticipantMutation = () => {
//   const queryClient = useQueryClient();
//   const { writeContractAsync, isPending, isSuccess } =
//     useWriteRewardManagementAcceptParticipant();

//   return useMutation({
//     mutationFn: async ({
//       taskId,
//       participant,
//       entityId,
//     }: {
//       taskId: string;
//       participant: string;
//       entityId: string;
//     }) => {
//       const result = await writeContractAsync({
//         address: (entityId as `0x${string}`) || "0x",
//         args: [taskId as `0x${string}`, participant as `0x${string}`],
//       });

//       return result;
//     },

//     onSuccess: async (result, variable) => {
//       await new Promise((resolve) => setTimeout(resolve, 9000));
//       await queryClient.invalidateQueries({
//         queryKey: ["taskParticipantsWithStatus", variable.taskId],
//       });
//     },
//   });
// };
const participateInTask = async (
  writeContractAsync: (config: any) => Promise<any>,
  taskId: string,
  entityId: string,
) => {
  const result = await writeContractAsync({
    address: entityId as `0x${string}`,
    args: [taskId as `0x${string}`],
  });
  return result;
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
  const { writeContractAsync } = useWriteEntityTaskManagerCompleteTask();
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
    completeTask: mutation.mutateAsync,
    completePending: mutation.isPending,
    completeSuccess: mutation.isSuccess,
  };
};

export const useTokenMint = () => {
  const { writeContractAsync } = useWriteRewardTokenMint();

  const token = process.env.NEXT_PUBLIC_RAHAT_TOKEN as `0x${string}`;
  const mutation = useMutation({
    mutationFn: async ({
      address,
      amount,
    }: {
      address: string;
      amount: number;
    }) => {
      const result = await writeContractAsync({
        address: token,
        args: [address as `0x${string}`, BigInt(amount)],
      });

      return result;
    },
  });
  return {
    tokenMint: mutation.mutateAsync,
    mintPending: mutation.isPending,
    mintSuccess: mutation.isSuccess,
    mintError: mutation.isError,
  };
};
