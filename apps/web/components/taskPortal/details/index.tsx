import { CustomAlertDialog } from "@/components/common/ui/alert.dialog";
import { DialogButton } from "@/components/common/ui/dialog";
import { Cuid } from "@/components/departments/details/details.main";
import { PATHS } from "@/routes/paths";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import TaskPortalParticipant from "./details.participant";
import TaskPortalDetails from "./details.task";

type TaskPortalMainProps = {
  cuid: Cuid;
  router: any;
};

const TaskPortalMain = ({ cuid, router }: TaskPortalMainProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);

  const { isConnected } = useAccount();

  const handleApplyTask = () => {
    if (isConnected) {
      setIsOpen(true);
    } else {
      setAlertDialog(true);
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
            <Button className="bg-[#297AD6]" onClick={handleApplyTask}>
              <span className="text-[#F8FAFC]">
                {isConnected === true ? "Mark as completed" : "Apply for task"}
              </span>{" "}
              <ArrowRight color="#F8FAFC" strokeWidth={2.5} size={20} />
            </Button>
          </div>
        </div>

        {alertDialog === true ? (
          <CustomAlertDialog
            alertDialog={alertDialog}
            setAlertDialog={setAlertDialog}
            textData="Connect your wallet first"
          />
        ) : (
          <DialogButton
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Are you sure you want to apply for this task?"
            subTitle="There are 5 more slots remaining in this task"
            buttonName="Apply"
          />
        )}

        <div className="flex w-full gap-4">
          <TaskPortalDetails cuid={cuid} />
        </div>

        <div className="flex w-full gap-4">
          <TaskPortalParticipant />
        </div>
      </div>
    </main>
  );
};

export default TaskPortalMain;
