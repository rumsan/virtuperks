import {
    useWriteEntityTaskManagerCompleteTask,
} from "@/hooks/wagmi/contracts";


const useCompleteTask = () => {
  const { writeContractAsync } = useWriteEntityTaskManagerCompleteTask();

  const handleCompleteTask = async (taskId: any, entityAddress:any) => {
    try {
      const result = await writeContractAsync({
        address: (entityAddress as `0x${string}`) || "0x",
        args: [taskId],
      });
      return result;
    } catch (error) {
      console.error("Error completing task:", error);
      throw error;
    }
  };

  return { handleCompleteTask };
};  

export default useCompleteTask;