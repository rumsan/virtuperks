import { QUERY_KEYS } from "@/hooks/subgraph/querycall";
import { useWriteEntityTaskManagerAcceptParticipant } from "@/hooks/wagmi/contracts";
import { useQueryClient } from "@tanstack/react-query";

const useAcceptParticipant = () => {
  const { writeContractAsync } = useWriteEntityTaskManagerAcceptParticipant();
  const queryClient = useQueryClient();

  const handleAcceptParticipant = async (id: `0x${string}`, participant: `0x${string}`) => {
    try {
      const result = await writeContractAsync({
        address: (process.env.NEXT_PUBLIC_ENTITY_ID as `0x${string}`) || "0x",
        args: [id, participant],
      });
      
      if (result) {
        console.log(result,'result from the acceptParticipant')
        // Invalidate queries using imported keys
        await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCEPTED] });
        await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PARTICIPANT] });
      }
    } catch (error) {
      console.error("Error accepting participant:", error);
    }
  };

  return { handleAcceptParticipant };
};

export default useAcceptParticipant;
