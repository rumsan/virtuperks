import { useAcceptParticipantMutation } from "@/hooks/subgraph/querycall";

const useAcceptParticipant = () => {
  const { mutateAsync: acceptParticipant } = useAcceptParticipantMutation();

  const handleAcceptParticipant = async (
    taskId: string, 
    participant: string, 
    entityId: string
  ) => {
    try {
      await acceptParticipant({ taskId, participant, entityId });
    } catch (error) {
      console.error("Error accepting participant:", error);
    }
  };

  return { handleAcceptParticipant };
};

export default useAcceptParticipant;
