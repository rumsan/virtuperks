import { CustomAlertDialog } from "@/components/common/ui/alert.dialog";
import { DialogButton } from "@/components/common/ui/dialog";
import { Cuid } from "@/components/departments/details/details.main";
import { useGetParticipantTaskStatus, useTaskList } from "@/hooks/subgraph/querycall";
import {
  useWriteEntityTaskManagerCompleteTask,
  useWriteEntityTaskManagerParticipate
} from "@/hooks/wagmi/contracts";
import { PATHS } from "@/routes/paths";
import { getDialogContents } from "@/utils/dialog";
import { TaskCreated } from "@workspace/types/task";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  const [isApplyLoading, setIsApplyLoading] = useState(false);
  const [isCompleteLoading, setIsCompleteLoading] = useState(false);
  const { isConnected, address } = useAccount();

  const getAllTask = useTaskList();
  const TaskList = getAllTask?.data?.data?.taskCreateds;
  const { participantTaskStatus } = useGetParticipantTaskStatus(address, cuid.id);


  const taskData = TaskList?.find((task: TaskCreated) => {
    return task?.id === cuid?.id;
  });

  const { writeContractAsync } =
    useWriteEntityTaskManagerParticipate();
  const { writeContractAsync: writeCompleteTask } =
    useWriteEntityTaskManagerCompleteTask();

  const handleApplyTask = () => {
    if (isConnected) {
      setIsOpen(true);
    } else {
      setAlertDialog(true);
    }
  };
  const handleCompletedTask = async () => {
    try {
      setIsCompleteLoading(true);
      const result = await writeCompleteTask({
        address: (taskData?.entityTaskManager?.id as `0x${string}`) || "0x",
        args: [taskData?.id],
      });
      if (result) {
        setIsOpen(false);
        setLocalButtonState("COMPLETED"); // Update local button state immediately
      }
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      setIsCompleteLoading(false);
    }
  };

  const handleApplyTaskLogic = async () => {
    try {
      setIsApplyLoading(true);
      const result = await writeContractAsync({
        address: (taskData?.entityTaskManager?.id as `0x${string}`) || "0x",
        args: [taskData?.id],
      });
      if (result) {
        setIsOpen(false);
        setLocalButtonState("UNACCEPTED"); // Update local button state immediately
      }
    } catch (error) {
      console.error("Error applying for task:", error);
    } finally {
      setIsApplyLoading(false);
    }
  };

  const getDialogHandler = () => {
    switch (participantTaskStatus?.status) {
      case "COMPLETED":
        return handleCompletedTask;
      case "WAITING":
        return undefined;
      case "VERIFIED":
        return undefined;
      default:
        return handleApplyTaskLogic;
    }
  };

  const getButtonContent = () => {
  
    const currentStatus = localButtonState || participantTaskStatus[0]?.status;
 

    switch (currentStatus) {
      case "COMPLETED":
        return (
          <Button className="bg-[#03AB65]" disabled>
            <span className="text-[#F8FAFC]">Task Completed</span>
          </Button>
        );

      case "ACCEPTED":
        return (
          <Button 
            className="bg-[#297AD6]" 
            onClick={handleCompletedTask}
            disabled={isCompleteLoading}
          >
            <span className="text-[#F8FAFC]">
              {isCompleteLoading ? "Processing..." : "Mark as completed"}
            </span>
            {!isCompleteLoading && (
              <ArrowRight color="#F8FAFC" strokeWidth={2.5} size={20} />
            )}
          </Button>
        );

      case "UNACCEPTED":
        return (
          <Button className="bg-[#F59E0B]" disabled>
            <span className="text-[#F8FAFC]">Waiting for Approval</span>
          </Button>
        );

      default:
        return (
          <Button 
            className="bg-[#297AD6]" 
            onClick={handleApplyTask}
            disabled={isApplyLoading}
          >
            <span className="text-[#F8FAFC]">
              {isApplyLoading ? "Processing..." : "Apply for task"}
            </span>
            {!isApplyLoading && (
              <ArrowRight color="#F8FAFC" strokeWidth={2.5} size={20} />
            )}
          </Button>
        );
    }
  };

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

        {alertDialog ? (
          <CustomAlertDialog
            alertDialog={alertDialog}
            setAlertDialog={setAlertDialog}
          />
        ) : (
          getDialogContents(participantTaskStatus?.status) && (
            <DialogButton
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              title={getDialogContents(participantTaskStatus?.status)?.title || ""}
              subTitle={getDialogContents(participantTaskStatus?.status)?.subTitle || ""}
              buttonName={getDialogContents(participantTaskStatus?.status)?.buttonName || ""}
              handleApplyTaskLogic={getDialogHandler()}
            />
          )
        )}

        <div className="flex w-full gap-4">
          <TaskPortalDetails taskData={taskData} />
        </div>

        <div className="flex w-full gap-4">
          <TaskPortalParticipant taskId={ cuid} />
        </div>
      </div>
    </main>
  );
};

export default TaskPortalMain;
