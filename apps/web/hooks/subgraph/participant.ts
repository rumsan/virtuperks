
import { useGraphService } from "@/providers/subgraph-provider";
import { useQuery } from "@tanstack/react-query";
import { useReadRewardManagementGetParticipantTaskAssignment, useReadRewardManagementIsTaskExpired } from "../wagmi/contracts";


export const useGetTaskListByParticipant = (
  participant: string,
  skip: boolean = false,
) => {
  const { queryService } = useGraphService();
 

    return useQuery({
      queryKey: ["myTask", participant],
      queryFn: async () => {
        const taskDetail =
          await queryService?.getParticipantTasks(participant);
        return taskDetail;
      },
      enabled: !!participant && !skip,
    });
  };




// to get the participant task assignment

export const useGetParticipantTaskAssignmet = (taskId:string, participant:string,  entityId:string) => {
  
  const data = useReadRewardManagementGetParticipantTaskAssignment({
    address: entityId as `0x${string}`,
    args: [taskId as `0x${string}`, participant as `0x${string}`],
  });

  return data
};


export const useGetParticipantStatistic = (participantAddress: string) => {
  const { queryService } = useGraphService();

  return useQuery({
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
};
