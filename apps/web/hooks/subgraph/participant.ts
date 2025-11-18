import { useGraphService } from "@/providers/subgraph-provider";
import { useQuery } from "@tanstack/react-query";
import { useReadRewardManagementGetParticipantTaskAssignment } from "../wagmi/contracts";

//praticipatig task
export const useGetTaskListByParticipant = (
  participant: string,
  skip: boolean = false,
) => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["myTask", participant],
    queryFn: async () => {
      const taskDetail = await queryService?.getParticipantTasks(participant);
      return taskDetail;
    },
    enabled: !!participant && !skip,
  });
};

// to get the participant task assignment
export const useGetParticipantTaskAssignmet = (
  taskId: string,
  participant: string,
  entityId: string,
) => {
  const data = useReadRewardManagementGetParticipantTaskAssignment({
    address: entityId as `0x${string}`,
    args: [taskId as `0x${string}`, participant as `0x${string}`],
  });
  return data;
};

export const useGetParticipantStatistic = (participantAddress: string) => {
  const { queryService } = useGraphService();

  const response = useQuery({
    queryKey: ["participantStatistic", participantAddress],
    queryFn: async () => {
      if (!queryService) {
        throw new Error("Subgraph query service is not initialized.");
      }
      const taskDetail =
        await queryService?.getParticipantTaskStatistics(participantAddress);
      return taskDetail;
    },
    enabled: !!participantAddress && !!queryService,
  });

  return {
    applied: response?.data?.data?.applied?.length || 0,
    completed: response?.data?.data?.completed?.length || 0,
    verified: response?.data?.data?.verified?.length || 0,
    accepted: response?.data?.data?.accepted?.length || 0,
  };
};

export const useGetParticipantTaskBasedOnStatus = (participantAddress: string) => {
  const { queryService } = useGraphService();

  const response = useQuery({
    queryKey: ["participantStatistic", participantAddress],
    queryFn: async () => {
      if (!queryService) {
        throw new Error("Subgraph query service is not initialized.");
      }
      const taskDetail =
        await queryService?.getParticipantTaskStatistics(participantAddress);
      return taskDetail;
    },
    enabled: !!participantAddress && !!queryService,
  });

  return {
    applied: response?.data?.data?.applied || 0,
    completed: response?.data?.data?.completed || 0,
    verified: response?.data?.data?.verified || 0,
    accepted: response?.data?.data?.accepted || 0,
  };
};

export const useGetWhiteListedParticipantByTask = (
  taskId: string,
  skip: boolean = false,
) => {
  const { queryService } = useGraphService();

  return useQuery({
    queryKey: ["whiteListedParticipantByTask", taskId],
    queryFn: async () => {
      const taskDetail =
        await queryService?.getWhitelistedParticipantsByTaskId(taskId);
      return taskDetail;
    },
    enabled: !!taskId && !skip,
  });
};
