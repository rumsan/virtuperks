import { Cuid } from "@/components/departments/details/details.main";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { Clock, Coins, ExternalLink, UserRoundCog, Users } from "lucide-react";
import { TaskList } from "../list";

type TaskDetailsProps = {
  cuid: Cuid;
};

const TaskDetails = ({ cuid }: TaskDetailsProps) => {
  console.log(cuid, "cuid");
  const taskData = TaskList.find((task) => task.cuid === cuid.id);

  console.log(taskData, "taskData");

  return (
    <Card>
      <CardTitle className="flex flex-col p-4 gap-1 w-full">
        <div className="flex items-center gap-2">
          <span>{taskData?.title}</span>
          <span className="w-20 h-6 flex items-center justify-center bg-green-50 rounded-full text-green-700 p-1 text-sm">
            {taskData?.status}
          </span>
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
            <span className="text-blue-500">View Github repository</span>
            {/* <span className="text-blue-500">{taskData?.url}</span> */}
            <ExternalLink size={16} color="#297ad6" strokeWidth={2.75} />
          </div>
          <div className="flex flex-col text-gray-400 gap-2 mt-2 mb-2">
            <span className="flex items-center gap-2">
              <UserRoundCog color="#64748b" size={20} strokeWidth={2.5} />
              {taskData?.owner}
            </span>
            <span className="flex items-center gap-2">
              <Users color="#64748b" size={20} strokeWidth={2.5} />
              {taskData?.participants} members participating
            </span>
            <span className="flex items-center gap-2">
              <Clock color="#64748b" size={20} strokeWidth={2.5} /> Deadline:{" "}
              {taskData?.date}
            </span>
          </div>
        </div>
      </CardTitle>

      <div className="flex items-center gap-2 pl-4 pb-2">
        <Coins color="#297ad6" />
        <span className="text-xl text-blue-600 font-bold">
          {taskData?.tokens} tokens
        </span>
      </div>

      <div className="flex items-center p-4">
        <span className="text-gray-600 text-sm">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </span>
      </div>
    </Card>
  );
};

export default TaskDetails;
