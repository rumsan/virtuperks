import { DialogButton } from "@/components/common/ui/dialog";
import { Cuid } from "@/components/departments/details/details.main";
import { useGetApprovedAndCompletedList, usegetSingTask } from "@/hooks/subgraph/querycall";
import { PATHS } from "@/routes/paths";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, CheckCircle, CircleX } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import useApproveTask from "./approve.task";
import TaskParticipant from "./details.participant";
import TaskDetails from "./details.task";

type TaskMainProps = {
  cuid: Cuid;
  router: AppRouterInstance;
};

const TaskMain = ({ cuid, router }: TaskMainProps) => {
  const {taskData} = usegetSingTask(cuid);
  const { completedData, approvedData } = useGetApprovedAndCompletedList(cuid.id);
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { handleApproveTask } = useApproveTask();
  const [isApproveLoading, setIsApproveLoading] = useState(false);

  const getApproveButtonState = () => {
    // If approved data exists, show approved state
    if (approvedData && approvedData.length > 0) {
      return {
        className: "border border-[#03AB65] bg-[#03AB65]",
        text: "Verified",
        disabled: true,
        onClick: undefined
      };
    }

    // If completed data exists but not approved, enable approve button
    if (completedData && completedData.length > 0) {
      return {
        className: "border border-[#03AB65]",
        text: isApproveLoading ? "Processing..." : "Approve",
        disabled: isApproveLoading,
        onClick: () => setIsOpen(true)
      };
    }

    // If neither exists, disable approve button
    return {
      className: "border border-[#03AB65]",
      text: "Approve",
      disabled: true,
      onClick: undefined
    };
  };

  const handleDialogAction = async () => {
    try {
      setIsApproveLoading(true);
      await handleApproveTask(cuid.id, taskData.entityTaskManager.id);
      setIsOpen(false);
      setLocalStatus("VERIFIED"); // Update local status immediately after successful approval
    } catch (error) {
      console.error("Error approving task:", error);
    } finally {
      setIsApproveLoading(false);
    }
  };

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full">
      <div className="space-y-4">
        <div
          onClick={() => router.push(PATHS.TASKS.HOME)}
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
            <Button 
              variant="outline" 
              className={getApproveButtonState().className}
              onClick={getApproveButtonState().onClick}
              disabled={getApproveButtonState().disabled}
            >
              <span className={approvedData && approvedData.length > 0 ? "text-white" : "text-[#03AB65]"}>
                {getApproveButtonState().text}
              </span>
              <CheckCircle 
                color={approvedData && approvedData.length > 0 ? "#ffffff" : "#03AB65"} 
                strokeWidth={2.5} 
                size={20} 
              />
            </Button>

            <Button variant="outline" className="border border-[#E44134]">
              <span className="text-[#E44134]">Close</span>{" "}
              <CircleX color="#E44134" strokeWidth={2.5} size={20} />
            </Button>

            <DialogButton
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              title="Are you sure you want to approve this task?"
              subTitle="This action cannot be undone"
              buttonName="Approve"
              handleApplyTaskLogic={handleDialogAction}
            />
          </div>
        </div>

        <div className="flex w-full gap-4">
          <TaskDetails cuid={cuid} />
        </div>

        <div className="flex w-full gap-4">
          <TaskParticipant taskId={cuid} />
        </div>
      </div>
    </main>
  );
};

export default TaskMain;
