import { PATHS } from "@/routes/paths";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { Coins, Dot, ExternalLink } from "lucide-react";
import { Task } from "../form/schema";

type ListCardDetailsProps = {
  taskList: Task[];
  router: any;
};

const ListCardDetails = ({ taskList, router }: ListCardDetailsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {taskList.map((task) => (
        <Card
          key={task.cuid}
          className="cursor-pointer"
          onClick={() =>
            task.cuid && router.push(PATHS.TASKS.DETAILS(task.cuid))
          }
        >
          <CardTitle className="flex flex-col p-4 gap-2">
            <div className="flex items-center gap-2">
              <span>{task.title}</span>
              <span className="w-20 h-6 flex items-center justify-center bg-green-50 rounded-full text-green-700 p-1 text-sm">
                {task.status}
              </span>
            </div>

            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
                <span className="text-blue-500">{task.url}</span>
                <ExternalLink size={16} color="#297ad6" strokeWidth={2.75} />
              </div>
              <div className="flex items-center text-gray-400">
                <span>{task.owner}</span>
                <Dot />
                <span>Deadline: {task.date}</span>
                <Dot />
                <span>{task.participants} members participating</span>
              </div>
            </div>
          </CardTitle>

          <div className="flex items-center gap-2 pl-4 pb-4">
            <Coins color="#297ad6" />
            <span className="text-xl text-blue-600 font-bold">
              {task.tokens} tokens
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ListCardDetails;
