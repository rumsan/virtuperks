import { useWriteEntityTaskManagerAcceptParticipant } from "@/hooks/wagmi/contracts";

const useAcceptParticipant = () => {
  const { writeContractAsync } = useWriteEntityTaskManagerAcceptParticipant();

  const handleAcceptParticipant = async (id: string, participant: string) => {
    await writeContractAsync({
      address: (process.env.NEXT_PUBLIC_ENTITY_ID as `0x${string}`) || "0x",
      args: [id as `0x${string}`, participant as `0x${string}`],
    });
  };

  return { handleAcceptParticipant };
};

export default useAcceptParticipant;
