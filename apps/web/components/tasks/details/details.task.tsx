import { Cuid } from "@/components/departments/details/details.main";
import { TaskList } from "@/sampleData";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { Clock, ExternalLink, Trophy, UserRoundCog, Users } from "lucide-react";

type TaskDetailsProps = {
  cuid: Cuid;
  router: any;
};

const TaskDetails = ({ cuid, router }: TaskDetailsProps) => {
  const taskData = TaskList.find((task) => task.cuid === cuid.id);

  return (
    <>
      <Card className="w-[80%] h-full p-4">
        <CardTitle className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-2">
            <span>{taskData?.title}</span>
            <span className="w-20 h-6 flex items-center justify-center bg-green-50 rounded-full text-green-700 p-1 text-sm font-normal">
              {taskData?.status}
            </span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
            <span className="text-blue-500 text-sm font-normal">
              View Github repository
            </span>
            <ExternalLink size={16} color="#297ad6" strokeWidth={2.75} />
          </div>
        </CardTitle>

        <div className="mt-3 mb-3 w-full overflow-hidden">
          <p className="text-gray-600 text-sm line-clamp-1">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
        </div>

        <div className="flex flex-col text-gray-500 font-normal gap-1 text-sm">
          <span className="flex items-center gap-2">
            <UserRoundCog color="#64748b" size={20} strokeWidth={2.5} />
            Task Owner: {taskData?.owner}
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
      </Card>

      <Card className="w-[20%] flex flex-col items-center justify-center ml-auto p-4 gap-3">
        <div className="flex items-center justify-center rounded-full h-10 w-10 bg-blue-50">
          <Trophy color="#297ad6" size={20} />
        </div>
        <span className="text-2xl text-blue-500 font-bold">100 Tokens</span>
      </Card>
    </>
  );
};

export default TaskDetails;
