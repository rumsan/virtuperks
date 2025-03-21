import { CustomAlertDialog } from "@/components/common/ui/alert.dialog";
import { DialogButton } from "@/components/common/ui/dialog";
import { useGetAcceptedList, useGetParticipantApplied, useGetTaskCompletedList, useTaskList } from "@/hooks/subgraph/querycall";
import {
  useWriteEntityTaskManagerCompleteTask,
  useWriteEntityTaskManagerParticipate
} from "@/hooks/wagmi/contracts";
import { PATHS } from "@/routes/paths";
import { getDialogContents } from "@/utils/dialog";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { getButtonState } from "./button.state";
import TaskPortalParticipant from "./details.participant";
import TaskPortalDetails from "./details.task";

type TaskPortalMainProps = {
  cuid: any;
  router: any;
};

const TaskPortalMain = ({ cuid, router }: TaskPortalMainProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [localButtonState, setLocalButtonState] = useState<string | null>(null);

  const { isConnected } = useAccount();
 

  const getAllTask = useTaskList();
  const TaskList = getAllTask?.data?.data?.taskCreateds;

  const taskData = TaskList?.find((task: any) => task?.id === cuid?.id);
 

  const { address } = useAccount();
  const { participantDatas } = useGetParticipantApplied(cuid)


  const { acceptedParticipant } = useGetAcceptedList(cuid);

  const { completedData } = useGetTaskCompletedList(cuid)
  const buttonState = getButtonState(participantDatas, acceptedParticipant, completedData, address || "");






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
    }
  };

  const handleApplyTaskLogic = async () => {
    try {
      const result = await writeContractAsync({
        address: (taskData?.entityTaskManager?.id as `0x${string}`) || "0x",
        args: [taskData?.id],
      });
      if (result) {
        setIsOpen(false);
        setLocalButtonState("WAITING"); // Update local button state immediately
      }
    } catch (error) {
      console.error("Error applying for task:", error);
    }
  };

  const getDialogHandler = () => {
    switch (buttonState) {
      case "COMPLETE":
        return handleCompletedTask;
      case "WAITING":
        return undefined;
      case "COMPLETED":
        return undefined;
      default:
        return handleApplyTaskLogic;
    }
  };


  const isTaskAlreadyCompleted = completedData?.some(
    (data: any) => data?.participant?.toLowerCase() === address?.toLowerCase()
  );

  const getButtonContent = () => {
    // Use localButtonState if available, otherwise use buttonState from props
    const currentState = localButtonState || buttonState;

    switch (currentState) {
      case "COMPLETED":
        return (
          <Button className="bg-[#03AB65]" disabled>
            <span className="text-[#F8FAFC]">Task Completed</span>
          </Button>
        );

      case "COMPLETE":
        return (
          <Button className="bg-[#297AD6]" onClick={handleCompletedTask}>
            <span className="text-[#F8FAFC]">Mark as completed</span>
            <ArrowRight color="#F8FAFC" strokeWidth={2.5} size={20} />
          </Button>
        );

      case "WAITING":
        return (
          <Button className="bg-[#F59E0B]" disabled>
            <span className="text-[#F8FAFC]">Waiting for Approval</span>
          </Button>
        );

      default:
        return (
          <Button className="bg-[#297AD6]" onClick={handleApplyTask}>
            <span className="text-[#F8FAFC]">Apply for task</span>
            <ArrowRight color="#F8FAFC" strokeWidth={2.5} size={20} />
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
          getDialogContents(buttonState) && (
            <DialogButton
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              title={getDialogContents(buttonState)?.title || ""}
              subTitle={getDialogContents(buttonState)?.subTitle || ""}
              buttonName={getDialogContents(buttonState)?.buttonName || ""}
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
