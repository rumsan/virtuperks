import { useApproveTaskMutation } from "@/hooks/subgraph/querycall";

const useApproveTask = () => {
  const { mutateAsync: approveTask } = useApproveTaskMutation();

  const handleApproveTask = async (taskId: string, entityId: string) => {
    try {
      await approveTask({ taskId, entityId });
    } catch (error) {
      console.error("Error approving task:", error);
    }
  };

  return { handleApproveTask };
};

export default useApproveTask;
