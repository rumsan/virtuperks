import { CustomAlertDialog } from "@/components/common/ui/alert.dialog";
import { DialogButton } from "@/components/common/ui/dialog";
import { Cuid } from "@/components/departments/details/details.main";
import { useGetAcceptedList, useGetTaskCompletedList, useTaskList } from "@/hooks/subgraph/querycall";
import {
  useWriteEntityTaskManagerCompleteTask,
  useWriteEntityTaskManagerParticipate,
} from "@/hooks/wagmi/contracts";
import { PATHS } from "@/routes/paths";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import TaskPortalParticipant from "./details.participant";
import TaskPortalDetails from "./details.task";

type TaskPortalMainProps = {
  cuid: any;
  router: any;
};

const TaskPortalMain = ({ cuid, router }: TaskPortalMainProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);

  const { isConnected } = useAccount();
 

  const getAllTask = useTaskList();
  const TaskList = getAllTask?.data?.data?.taskCreateds;

  const taskData = TaskList?.find((task: any) => task?.id === cuid?.id);
 

  const { address } = useAccount();

  const { acceptedParticipant } = useGetAcceptedList(cuid);
  const { completedData } = useGetTaskCompletedList(cuid)



  const abc = acceptedParticipant?.find((task:any) => {
    return task?.taskDetail?.id === cuid?.id;
  });

  function handleStatus(address, abc) {
    const isValidAddress = abc?.taskDetail?.allowedWallets?.map((add) => {
      return add === address?.toLowerCase();
    });

    return isValidAddress ? abc?.status : "Invalid";
  }

  const isAccepted = handleStatus(address, abc);

  const { writeContractAsync: writeParticipant } =
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

  const handleApplyTaskLogic = async () => {
    const result = await writeParticipant({
      address: (taskData?.entityTaskManager?.id as `0x${string}`) || "0x",
      args: [taskData?.id],
    });
  };

  const isTaskAlreadyCompleted = completedData?.some(
    (data: any) => data?.participant?.toLowerCase() === address?.toLowerCase()
  );

  const handleCompletedTask = async () => {
    try {
      const result = await writeCompleteTask({
        address: (taskData?.entityTaskManager?.id as `0x${string}`) || "0x",
        args: [abc?.taskDetail?.id],
      });
      
      // Set local state after successful completion
      if (result) {
        setIsTaskCompleted(true);
      }
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const getButtonContent = () => {
    if (isTaskAlreadyCompleted || isTaskCompleted) {
      return (
        <Button className="bg-[#03AB65]" disabled>
          <span className="text-[#F8FAFC]">Task Completed</span>
        </Button>
      );
    }

    if (isAccepted === "ACCEPTED") {
      return (
        <Button className="bg-[#297AD6]" onClick={handleCompletedTask}>
          <span className="text-[#F8FAFC]">Mark as completed</span>
          <ArrowRight color="#F8FAFC" strokeWidth={2.5} size={20} />
        </Button>
      );
    }

    return (
      <Button className="bg-[#297AD6]" onClick={handleApplyTask}>
        <span className="text-[#F8FAFC]">Apply for task</span>
        <ArrowRight color="#F8FAFC" strokeWidth={2.5} size={20} />
      </Button>
    );
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

        {alertDialog === true ? (
          <CustomAlertDialog
            alertDialog={alertDialog}
            setAlertDialog={setAlertDialog}
          />
        ) : (
          <DialogButton
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Are you sure you want to apply for this task?"
            subTitle="There are 5 more slots remaining in this task"
            buttonName="Apply"
            handleApplyTaskLogic={handleApplyTaskLogic}
          />
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
