
import { useQuery } from "@tanstack/react-query";
import { useGraphService } from "@/providers/subgraph-provider";


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


// export const useGetAllParticipantsByRole = (
//   role: string,
//   skip: boolean = false,
// ) => {
//   const { queryService } = useGraphService();

//   return useQuery({
//     queryKey: ["participantsByRole", role],
//     queryFn: async () => {
//       const participants = await queryService?.getAllParticipantsByRole(role);
//       return participants;
//     },
//     enabled: !!role && !skip,
//   });
// };
