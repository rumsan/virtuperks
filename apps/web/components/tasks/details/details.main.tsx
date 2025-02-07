import { Cuid } from "@/components/departments/details/details.main";
import { PATHS } from "@/routes/paths";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, CircleX, PencilLine } from "lucide-react";
import TaskParticipant from "./details.participant";
import TaskDetails from "./details.task";

type TaskMainProps = {
  cuid: Cuid;
  router: any;
};

const TaskMain = ({ cuid, router }: TaskMainProps) => {
  return (
    <main className="gap-2 p-4 sm:px-8 sm:py-10 md:gap-8 w-full">
      <div className="space-y-4">
        <div
          onClick={() => router.push(PATHS.TASKS.HOME)}
          className="flex items-center gap-2 cursor-pointer hover:text-gray-400"
        >
          <ArrowLeft size={24} strokeWidth={2} />
          <span className="font-base text-gray-700">Back</span>
        </div>
        <div className="flex items-center">
          <div className="flex flex-col gap-1 my-2">
            <h1 className="font-bold text-4xl">Task Details</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              Detailed view of the selected task
            </h3>
          </div>
          <div className="flex items-center ml-auto gap-4">
            <Button variant="outline" className="border border-#297ad6">
              Edit <PencilLine color="#297ad6" />
            </Button>
            <Button variant="outline">
              Close <CircleX color="#e44134" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TaskDetails cuid={cuid} />
          <TaskParticipant router={router} />
        </div>
      </div>
    </main>
  );
};

export default TaskMain;
