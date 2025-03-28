import { CustomAlertDialog } from "@/components/common/ui/alert.dialog";
import { DialogButton } from "@/components/common/ui/dialog";
import { Cuid } from "@/components/departments/details/details.main";
import { useCompleteTaskMutation, useGetParticipantTaskStatus, useParticipateTaskMutation } from "@/hooks/subgraph/querycall";
import { useGetTaskDetailById } from "@/hooks/subgraph/taskDetail";
import { PATHS } from "@/routes/paths";
import { getDialogContents } from "@/utils/dialog";
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

const { participantTaskStatus } = useGetParticipantTaskStatus(address, cuid.id);



  const getTaskDetail = useGetTaskDetailById(cuid.id);
   
  const taskData = getTaskDetail?.data?.data?.taskCreateds[0]


  // const { writeContractAsync,isPending:participatePending, isSuccess:participateSuccess } =
  //   useWriteEntityTaskManagerParticipate();
  // const { writeContractAsync: writeCompleteTask, isPending:completePending, isSuccess:completSucces } =
  //   useWriteEntityTaskManagerCompleteTask();
  const { participateTask, participatePending, participateSuccess} = useParticipateTaskMutation()
  const compleTask = useCompleteTaskMutation()

  const handleApplyTask = () => {
    if (isConnected ) {
      setIsOpen(true);
    } else {
      setAlertDialog(true);
    }
  };
  const handleCompletedTask = async () => {
    try {
      setIsCompleteLoading(true);
      const result = await compleTask.mutateAsync({
        taskId: taskData?.internal_id,
        entityId:taskData?.entityTaskManager?.entityTaskManager as `0x${string}`
      });
      if (result) {
        console.log("Task completed successfully");
        setIsOpen(false);
        setLocalButtonState("COMPLETED"); // Update local button state immediately
      }
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      setIsCompleteLoading(false);
    }
  };
  // const handleApplyTaskLogic = async () => {
  //   return new Promise<void>((resolve, reject) => {
  //     participateTask(
  //       { taskId: cuid.id, entityId: taskData?.entityTaskManager?.entityTaskManager || "0x" },
  //       {
  //         onSuccess: () => {
  //           setIsOpen(false);
  //           setLocalButtonState("UNACCEPTED");
  //           resolve();
  //         },
  //         onError: (error) => {
  //           console.error("Error applying for task:", error);
  //           reject(error);
  //         },
  //       }
  //     );
  //   });
  // };

  const handleApplyTaskLogic = async () => {
    return new Promise<void>((resolve, reject) => {
      participateTask(
        { taskId: cuid.id, entityId: taskData?.entityTaskManager?.entityTaskManager || "0x" },
        {
          onSuccess: () => {
            setIsOpen(false);
            setLocalButtonState("UNACCEPTED");
            resolve();
          },
          onError: (error) => {
            console.error("Error applying for task:", error);
            reject(error);
          },
        }
      );
    });
  };

  // const handleApplyTaskLogic = async () => {
  //   try {
 
  //     const result = await participateTask({
  //      taskId:taskData?.internal_id,
  //       entityId:taskData?.entityTaskManager?.entityTaskManager,
  //     });
  //     if (result) {
  //       setIsOpen(false);
  //       setLocalButtonState("UNACCEPTED"); // Update local button state immediately
  //     }
  //   } catch (error) {
  //     console.error("Error applying for task:", error);
  //   } finally {
  //     setIsApplyLoading(false);
  //   }
  // };

  const getDialogHandler = () => {
    switch (participantTaskStatus[0]?.status) {
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
    console.log("participantTaskStatus", participantTaskStatus);
    console.log("currentStatus", currentStatus);
 

    switch (currentStatus) {
      case "COMPLETED":
        return (
          <Button className="bg-[#03AB65]" disabled>
            <span className="text-[#F8FAFC]">Task Completed</span>
          </Button>
        );

      // case "ACCEPTED":
      //   return (
      //     <Button 
      //       className="bg-[#297AD6]" 
      //       onClick={handleCompletedTask}
      //       disabled={completePending}
      //     >
      //       <span className="text-[#F8FAFC]">
      //         {completePending ? "Processing..." : "Mark as completed"}
      //       </span>
      //       {!completePending && (
      //         <ArrowRight color="#F8FAFC" strokeWidth={2.5} size={20} />
      //       )}
      //     </Button>
      //   );

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
            disabled={participatePending}
          >
            <span className="text-[#F8FAFC]">
              {participatePending ? "Processing..." : "Apply for task"}
            </span>
            {!participatePending && (
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
        ) : (!participatePending && isOpen &&
          getDialogContents(participantTaskStatus?.[0]?.status) && (
            <DialogButton
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              title={getDialogContents(participantTaskStatus?.status)?.title || ""}
              subTitle={getDialogContents(participantTaskStatus?.status)?.subTitle || ""}
              buttonName={getDialogContents(participantTaskStatus?.status)?.buttonName || ""}
              handleApplyTaskLogic={handleApplyTaskLogic}
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
