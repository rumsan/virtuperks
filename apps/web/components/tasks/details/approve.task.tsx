import { useWriteEntityTaskManagerVerifyCompletion } from "@/hooks/wagmi/contracts";
import { useQueryClient } from "@tanstack/react-query";

const useApproveTask = () => {
  const { writeContractAsync } = useWriteEntityTaskManagerVerifyCompletion();
  const queryClient = useQueryClient();

  const handleApproveTask = async (taskId: string) => {
    try {
      const result = await writeContractAsync({
        address: (process.env.NEXT_PUBLIC_ENTITY_ID as `0x${string}`) || "0x",
        args: [taskId as `0x${string}`],
      });

      if (result) {
        // Invalidate relevant queries
        await queryClient.invalidateQueries({ queryKey: ["completed"] });
        await queryClient.invalidateQueries({ queryKey: ["participant"] });
      }
    } catch (error) {
      console.error("Error approving task:", error);
    }
  };

  return { handleApproveTask };
};

export default useApproveTask;
