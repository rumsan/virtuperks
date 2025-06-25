import { CustomAlertDialog } from "@/components/common/ui/alert.dialog";
import { Cuid } from "@/components/departments/details/details.main";
// import {
//   useCompleteTaskMutation,
//   useGetParticipantTaskStatus,
//   useParticipateTaskMutation,
// } from "@/hooks/subgraph/querycall";
import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import { DialogButton } from "@/components/common/ui/dialog";
import {
  useCheckParticipantStatus,
  useCompleteTaskMutation,
  useParticipateTaskMutation,
} from "@/hooks/subgraph/querycall";
import { useGetTaskById } from "@/hooks/subgraph/task";
import { PATHS } from "@/routes/paths";
import { Button } from "@workspace/ui/components/button";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { useAccount } from "wagmi";
import TaskPortalParticipant from "./details.participant";
import TaskPortalDetails from "./details.task";

type TaskPortalMainProps = {
  cuid: Cuid;
  router: AppRouterInstance;
};

const TaskPortalMain = ({ cuid, router }: TaskPortalMainProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);
  const [localButtonState, setLocalButtonState] = useState<string | null>(null);

  const { isConnected, address } = useAccount();

  const getTaskDetail = useGetTaskById(cuid.id);

  const { toast } = useToast();
  const taskData = getTaskDetail?.data?.data?.taskCreated;

  const { participateTask, participatePending, participateSuccess } =
    useParticipateTaskMutation();
  const { completeTask, completePending } = useCompleteTaskMutation();

  const { status: participantStatus, isLoading: statusLoading } =
    useCheckParticipantStatus(
      taskData?.internal_id,
      taskData?.rewardManagement?.rewardManagement,
    );
  console.log("Participant Status:", participantStatus);

  const handleApplyTask = async () => {
    if (!isConnected) {
      setAlertDialog(true);
      return;
    }

    try {
      await participateTask(
        {
          taskId: taskData?.internal_id,
          entityId: taskData?.rewardManagement?.rewardManagement || "0x",
        },
        {
          onSuccess: () => {
            // Update local state to PENDING (1) instead of "WAITING"
            // setLocalButtonState("1");
            setLocalButtonState("WAITING");
            toast({
              title: "Task Application Submitted Successfully!",
              variant: "success",
            });
          },
          onError: (error) => {
            console.error("Error applying for task:", error);
            toast({
              title: "Failed To Apply For Task. Please Try Again.",
              variant: "destructive",
            });
          },
        },
      );
    } catch (error) {
      console.error("Error in application:", error);
    }
  };

  const handleCompleteTask = async (data: any) => {
    try {
      await completeTask(
        {
          taskId: taskData?.internal_id,
          entityId: taskData?.rewardManagement?.rewardManagement || "0x",
          completionUrl: data.completionUrl,
        },
        {
          onSuccess: () => {
            setIsOpen(false);
            setLocalButtonState("COMPLETED");
            toast({
              title: "Task Completed Successfully!",
              variant: "success",
            });
          },
          onError: (error) => {
            console.error("Error completing task:", error);
            toast({
              title: "Failed to complete task. Please try again.",
              variant: "destructive",
            });
          },
        },
      );
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const getButtonContent = () => {
    if (statusLoading) {
      return (
        <Button disabled>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading...
        </Button>
      );
    }

    // Convert localButtonState to number if it's a string
    const effectiveStatus = localButtonState ?? participantStatus;
    console.log(effectiveStatus, "effectiveStatus");

    switch (effectiveStatus) {
      case 0: // NONE
        return (
          <Button
            className="bg-[#297AD6]"
            onClick={handleApplyTask}
            disabled={participatePending}
          >
            {participatePending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <span className="text-[#F8FAFC]">Apply for task</span>
                <ArrowRight color="#F8FAFC" strokeWidth={2.5} size={20} />
              </>
            )}
          </Button>
        );
      case "WAITING":
      case 1: // PENDING
        return (
          <Button className="bg-[#F59E0B]" disabled>
            <span className="text-[#F8FAFC]">Waiting for Approval</span>
          </Button>
        );
      case "ACCEPTED":
      case 2: // ACCEPTED
        return (
          <>
            <Button
              className="bg-green-500"
              onClick={() => setIsOpen(true)}
              disabled={completePending}
            >
              {completePending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <span className="text-[#F8FAFC]">Mark as complete</span>
              )}
            </Button>
            {!completePending && isOpen && (
              <DialogButton
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Complete Task"
                subTitle="Please provide the completion URL"
                buttonName="Submit"
                submitType="Complete"
                handleApplyTaskLogic={handleCompleteTask}
              />
            )}
          </>
        );

      case "COMPLETED":
      case 3:
        return (
          <Button
            className="bg-green-500 disabled:bg-green-500"
            disabled={true}
          >
            <span className="text-[#F8FAFC]">{"Completed"}</span>
          </Button>
        );
      case "VERIFIED":
      case 4: // verified
        return (
          <Button className="bg-[#22C55E]" disabled>
            <span className="text-[#F8FAFC]">Verified</span>
          </Button>
        );

      default:
        return null;
    }
  };

  if (getTaskDetail.isLoading) {
    return (
      <LoaderSkeleton
        backButton
        title
        subtitle
        titleWidth="w-64"
        subtitleWidth="w-72"
        cardCount={2} // TaskDetails + Participants
        gridCols="grid-cols-1" // stacked sections
        cardHeight="h-60"
        showPagination={false}
      />
    );
  }

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full">
      <div className="space-y-4">
        <div
          onClick={() => router.push(PATHS.TASKPORTAL.HOME)}
          className="flex items-center gap-2 cursor-pointer hover:text-gray-400 my-3"
        >
          <ArrowLeft size={24} strokeWidth={2} />
          <span className="font-base text-gray-700">Back</span>
        </div>
        <div className="flex items-center">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-4xl">Task Details</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              Detailed view of the selected task
            </h3>
          </div>
          <div className="flex items-center ml-auto gap-4">
            {getButtonContent()}
          </div>
        </div>

        {alertDialog && (
          <CustomAlertDialog
            alertDialog={alertDialog}
            setAlertDialog={setAlertDialog}
            textData="Connect your wallet first"
          />
        )}

        <div className="flex w-full gap-4">
          <TaskPortalDetails taskData={taskData} />
        </div>

        <div className="flex w-full gap-4">
          <TaskPortalParticipant taskId={cuid} />
        </div>
      </div>
    </main>
  );
};

export default TaskPortalMain;
