import { DialogButton } from "@/components/common/ui/dialog";
import { Cuid } from "@/components/departments/details/details.main";
import { useGetApprovedList } from "@/hooks/subgraph/querycall";
import { PATHS } from "@/routes/paths";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, CheckCircle, CircleX } from "lucide-react";
import { useState } from "react";
import TaskParticipant from "./details.participant";
import TaskDetails from "./details.task";
import useApproveTask from "./approve.task";

type TaskMainProps = {
  cuid: Cuid;
  router: any;
};

const TaskMain = ({ cuid, router }: TaskMainProps) => {
  const { approvedData } = useGetApprovedList(cuid);
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
    const { handleApproveTask } = useApproveTask();

  // Check if task is already verified from stored data
  const isVerified = approvedData?.some((data: any) => data.status === "VERIFIED");

  // Use either immediate status change or stored verified status
  const currentStatus = localStatus || (isVerified ? "VERIFIED" : null);

  const handleDialogAction = async () => {
    try {
      await handleApproveTask(cuid.id);
      setIsOpen(false);
      setLocalStatus("VERIFIED"); // Update local status immediately after successful approval
    } catch (error) {
      console.error("Error approving task:", error);
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
              className={currentStatus === "VERIFIED" ? "border border-[#03AB65] bg-[#03AB65]" : "border border-[#03AB65]"}
              onClick={() => setIsOpen(true)}
              disabled={currentStatus === "VERIFIED"}
            >
              <span className={currentStatus === "VERIFIED" ? "text-white" : "text-[#03AB65]"}>
                {currentStatus === "VERIFIED" ? "Verified" : "Approve"}
              </span>
              <CheckCircle 
                color={currentStatus === "VERIFIED" ? "#ffffff" : "#03AB65"} 
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
          <TaskDetails cuid={cuid} router={router} />
        </div>

        <div className="flex w-full gap-4">
          <TaskParticipant taskId={cuid} router={router} />
        </div>
      </div>
    </main>
  );
};

export default TaskMain;
