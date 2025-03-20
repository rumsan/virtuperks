import { useWriteEntityTaskManagerVerifyCompletion }from "@/hooks/wagmi/contracts";

const useApproveTask = () => {
  const {writeContractAsync } = useWriteEntityTaskManagerVerifyCompletion();

  const handleApproveTask = async (taskId: any) => {
  
    try {
      const result = await writeContractAsync({
        address: (process.env.NEXT_PUBLIC_ENTITY_ID as `0x${string}`) || "0x",
        args: [taskId],
      });
      
      return result;
    } catch (error) {
      console.error("Error approving task:", error);
      throw error;
    }
  };

  return { handleApproveTask };
};

export default useApproveTask;
