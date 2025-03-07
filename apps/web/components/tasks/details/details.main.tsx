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
            <Button variant="outline" className="border border-[#297AD6]">
              <span className="text-[#297AD6]">Edit</span>{" "}
              <PencilLine color="#297AD6" strokeWidth={2.5} size={20} />
            </Button>
            <Button variant="outline" className="border border-[#E44134]">
              <span className="text-[#E44134]">Close</span>{" "}
              <CircleX color="#E44134" strokeWidth={2.5} size={20} />
            </Button>
          </div>
        </div>

        <div className="flex w-full gap-4">
          <TaskDetails cuid={cuid} router={router} />
        </div>

        <div className="flex w-full gap-4">
          <TaskParticipant router={router} />
        </div>
      </div>
    </main>
  );
};

export default TaskMain;
