import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import { DialogButton } from "@/components/common/ui/dialog";
import { DisperseButton } from "@/components/common/ui/disperse-button";
import { Cuid } from "@/components/departments/details/details.main";
import { useGetEntityRole } from "@/hooks/subgraph/entity";
import {
  useCheckParticipantStatus,
  useGetCombineStausByTask,
} from "@/hooks/subgraph/querycall";
import {
  useCheckTaskStatus,
  useCheckTaskVerifiedParticipant,
  useCloseTaskMutation,
  useGetRejectedParticipants,
  useGetTaskById,
} from "@/hooks/subgraph/task";
import { useDisburseTokenToTask } from "@/hooks/subgraph/token";
import { PATHS } from "@/routes/paths";
import hasRole from "@/utils/role";
import { Button } from "@workspace/ui/components/button";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { Ban, CircleX, Loader2 } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { useAccount } from "wagmi";
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
  const { address } = useAccount();

  const taskData = getTaskDetail?.data?.data?.taskCreateds[0];

  const { entityRole, roleLoading } = useGetEntityRole(
    taskData?.rewardManagement?.rewardManagement || "",
  );
  const hasEntityOwnerRole = !!hasRole({
    role: entityRole || "",
    address,
  });

  const { status: participantStatus, isLoading: statusLoading } =
    useCheckParticipantStatus(
      taskData?.internal_id,
      taskData?.rewardManagement?.rewardManagement,
    );
  const fetchRejectedParticipant = useGetRejectedParticipants(cuid.id);

  const { verifiedTaskParticipant: verifiedParticipants } =
    useCheckTaskVerifiedParticipant(
      taskData?.internal_id,
      taskData?.rewardManagement?.rewardManagement,
    );
  const hasVerifiedParticipants = (verifiedParticipants?.length ?? 0) > 0;
  const {
    taskDetail,
    status: isTokenDisbursedFromContract,
    statusLoading: taskDetailLoading,
  } = useCheckTaskStatus(
    taskData?.internal_id ?? "",
    taskData?.rewardManagement.rewardManagement ?? "",
  );

  const isTaskExpired = !taskDetail?.isOpen;
  const { disburseTokenToTask, disbursePending } = useDisburseTokenToTask();
  const closeTaskMutation = useCloseTaskMutation();

  const taskReady = !taskDetailLoading;
  // const isDisburseButtonDisabled =
  //   !taskReady ||
  //   isTokenDisbursedFromContract ||
  //   hasVerifiedParticipants == false;
  const isCloseButtonDisabled =
    !taskReady || isTaskExpired || !hasEntityOwnerRole;

  const {
    pendingParticipants,
    acceptedParticipants,
    completedParticipants,
    verifiedPartcipants,
    rejectedParticipants,
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
        duration: 2000,
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
      toast({
        title: "Disperse Token Successfully!",
        variant: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error approving task:", error);
      toast({
        title: "Failed To Approve Task. Please Try Again.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Calculate if button should be disabled
  const isDisburseButtonDisabled =
    !taskReady || !hasVerifiedParticipants || !hasEntityOwnerRole;

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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 hover:text-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
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

          <div className="flex items-center ml-auto gap-8 mb-5">
            <DisperseButton
              isDispersed={!!isTokenDisbursedFromContract}
              isDisabled={isDisburseButtonDisabled}
              hasVerifiedParticipants={hasVerifiedParticipants}
              hasEntityOwnerRole={hasEntityOwnerRole}
              onClick={() => setIsOpen(true)}
            />
            <div className="relative group">
              {/* Wrapper hides cursor */}
              <div className={`${isCloseButtonDisabled ? "cursor-none" : ""}`}>
                <Button
                  variant="outline"
                  className="border border-[#E44134] flex items-center gap-2 hover:bg-gray-50"
                  onClick={handleCloseTask}
                  disabled={isCloseButtonDisabled}
                >
                  {closeTaskMutation.isPending ? (
                    <span className="flex items-center gap-2 text-[#E44134]">
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
              </div>

              {/* Show Ban icon when disabled and hovered */}
              {isCloseButtonDisabled && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                  <Ban color="#E44134" strokeWidth={2.5} size={24} />
                </div>
              )}
            </div>

            <DialogButton
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              title="Are you sure you want to disperse the amount?"
              subTitle="This action cannot be undone"
              buttonName="Disperse"
              submitType="Disperse"
              handleApplyTaskLogic={handleDialogAction}
              availableTokens={Number(
                taskData?.taskDetail?.totalRewardAmount ?? 0,
              )}
            />
          </div>
        </div>

        <div className="flex w-full gap-4 mt-5">
          <TaskDetails taskData={taskData} />
        </div>

        <div className="flex w-full gap-4">
          <TaskParticipant
            taskData={taskData}
            pendingParticipants={pendingParticipants}
            acceptedParticipants={acceptedParticipants}
            completedParticipants={completedParticipants}
            verifiedPartcipants={verifiedPartcipants}
            rejectedParticipants={rejectedParticipants}
          />
        </div>
      </div>
    </main>
  );
};

export default TaskMain;
