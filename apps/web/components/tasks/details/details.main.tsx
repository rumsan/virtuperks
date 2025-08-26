import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import { DialogButton } from "@/components/common/ui/dialog";
import { Cuid } from "@/components/departments/details/details.main";
import { useGetCombineStausByTask } from "@/hooks/subgraph/querycall";
import {
  useCheckTaskStatus,
  useCloseTaskMutation,
  useGetTaskById,
} from "@/hooks/subgraph/task";
import { useDisburseTokenToTask } from "@/hooks/subgraph/token";
import { PATHS } from "@/routes/paths";
import { Button } from "@workspace/ui/components/button";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { CheckCircle, CircleX, Loader2 } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import TaskParticipant from "./details.participant";
import TaskDetails from "./details.task";

type TaskMainProps = {
  cuid: Cuid;
  router: AppRouterInstance;
};

const TaskMain = ({ cuid, router }: TaskMainProps) => {
  const getTaskDetail = useGetTaskById(cuid.id);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isDisbursed, setIsDisbursed] = useState(false);

  const taskData = getTaskDetail?.data?.data?.taskCreateds[0];

  // const { status: isTaskExpired, statusLoading: isTaskExpiredLoading } =
  //   useIsTaskExpired(
  //     taskData?.internal_id,
  //     taskData?.rewardManagement.rewardManagement,
  //   );

  const {
    taskDetail,
    status: isTokenDisbursedFromContract,
    statusLoading: taskDetailLoading,
  } = useCheckTaskStatus(
    taskData?.internal_id ?? "",
    taskData?.rewardManagement.rewardManagement ?? "",
  );
  const participantDataLoading = !taskData;
  const isTaskExpired = !taskDetail?.isOpen;
  const { disburseTokenToTask, disbursePending } = useDisburseTokenToTask();
  const closeTaskMutation = useCloseTaskMutation();

  const taskReady = !taskDetailLoading;
  const isDisburseButtonDisabled = !taskReady || isTokenDisbursedFromContract;
  const isCloseButtonDisabled = !taskReady || isTaskExpired;
  const taskLoading = getTaskDetail.isLoading;

  const {
    pendingParticipants,
    acceptedParticipants,
    completedParticipants,
    verifiedPartcipants,
    combineParticipantsLoading: participantsLoading,
  } = useGetCombineStausByTask(taskData?.internal_id);

  const handleCloseTask = async () => {
    try {
      await closeTaskMutation.mutateAsync({
        taskId: taskData.internal_id,
        entityId: taskData.rewardManagement.rewardManagement,
      });
      toast({ title: "Task closed successfully!", variant: "success" });
    } catch (error) {
      console.error("Error closing task:", error);
      toast({
        title: "Failed to close task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDialogAction = async (data: any) => {
    try {
      await disburseTokenToTask({
        taskId: taskData.internal_id,
        amount: data.amount,
        entityId: taskData.rewardManagement.rewardManagement,
      });
      setIsOpen(false);
      setIsDisbursed(true);
      toast({ title: "Disperse Token Successfully!", variant: "success" });
    } catch (error) {
      console.error("Error approving task:", error);
      toast({
        title: "Failed To Approve Task. Please Try Again.",
        variant: "destructive",
      });
    }
  };

  const getDisburseButton = () => {
    if (disbursePending) {
      return (
        <Button variant="outline" className="border border-[#03AB65]" disabled>
          <span className="text-[#03AB65] flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </span>
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        style={{ border: "1px solid #03AB65" }}
        onClick={() => setIsOpen(true)}
        disabled={isDisburseButtonDisabled}
      >
        <span className="text-[#03AB65]">Disperse Token</span>
        <CheckCircle
          className="ml-2"
          style={{ color: "#03AB65", strokeWidth: 2.5, width: 20, height: 20 }}
        />
      </Button>
    );
  };

  const isLoading =
    getTaskDetail.isLoading ||
    taskDetailLoading ||
    disbursePending ||
    participantsLoading;

  if (isLoading) {
    return (
      <LoaderSkeleton
        backButton
        title
        subtitle
        titleWidth="w-64"
        subtitleWidth="w-72"
        cardCount={2}
        gridCols="grid-cols-1"
        cardHeight="h-44"
        showPagination={false}
      />
    );
  }

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full">
      <div className="space-y-4 mt-5">
        <button
          onClick={() => router.push(PATHS.TASKS.HOME)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 font-bold hover:bg-blue-50 hover:text-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <span className="text-lg">&larr;</span>
          <span>Back to Task List</span>
        </button>

        <div className="flex items-center">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-4xl">Task Details</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              Detailed view of the selected task
            </h3>
          </div>

          <div className="flex items-center ml-auto gap-4">
            {getDisburseButton()}

            <Button
              variant="outline"
              className="border border-[#E44134]"
              onClick={handleCloseTask}
              disabled={isCloseButtonDisabled}
            >
              {closeTaskMutation.isPending ? (
                <span className="text-[#E44134] flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Closing...
                </span>
              ) : (
                <>
                  <span className="text-[#E44134]">Close</span>
                  <CircleX color="#E44134" strokeWidth={2.5} size={20} />
                </>
              )}
            </Button>

            {!disbursePending && isOpen && (
              <DialogButton
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Are you sure you want to disperse the amount?"
                subTitle="This action cannot be undone"
                buttonName="Disperse"
                submitType="Disperse"
                handleApplyTaskLogic={handleDialogAction}
              />
            )}
          </div>
        </div>

        <div className="flex w-full gap-4">
          <TaskDetails taskData={taskData} />
        </div>

        <div className="flex w-full gap-4">
          <TaskParticipant
            taskData={taskData}
            pendingParticipants={pendingParticipants}
            acceptedParticipants={acceptedParticipants}
            completedParticipants={completedParticipants}
            verifiedPartcipants={verifiedPartcipants}
          />
        </div>
      </div>
    </main>
  );
};

export default TaskMain;
