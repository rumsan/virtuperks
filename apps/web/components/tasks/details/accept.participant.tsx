import { useWriteEntityTaskManagerAcceptParticipant } from "@/hooks/wagmi/contracts";



const useAcceptParticipant = () => {
  const { writeContractAsync } = useWriteEntityTaskManagerAcceptParticipant();

  const handleAcceptParticipant = async (id, participant) => {
    console.log("taskid from accept", id);
    console.log("participant from accept", participant);
   
    
     const result = await writeContractAsync({
      address: (process.env.NEXT_PUBLIC_ENTITY_ID as `0x${string}`) || "0x",
      args: [id, participant],
     });
  
  };

 
  return { handleAcceptParticipant };
};

export default useAcceptParticipant;
