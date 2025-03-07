import { PATHS } from "@/routes/paths";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { Coins, Dot, ExternalLink } from "lucide-react";
import { Task } from "../form/schema";

type ListCardDetailsProps = {
  taskList: Task[];
  router: any;
  tabStatus: string;
};

const ListCardDetails = ({
  taskList,
  router,
  tabStatus,
}: ListCardDetailsProps) => {
 
  const filteredTaskList = () => {
    if (tabStatus === "active") {
      return taskList.filter((task) => task.status.toLowerCase() === "open");
    } else if (tabStatus === "completed") {
      return taskList.filter(
        (task) =>
          task.status.toLowerCase() === "approved" ||
          task.status.toLowerCase() === "closed" ||
          task.status.toLowerCase() === "completed",
      );
    }
    return taskList;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {filteredTaskList().map((task) => (
        <Card
          key={task.cuid}
          className="cursor-pointer"
          onClick={() =>
            task.cuid && router.push(PATHS.TASKS.DETAILS(task.cuid))
          }
        >
          <CardTitle className="flex flex-col p-4 gap-2">
            <div className="flex items-center gap-2 text-[#334155]">
              <span>{task.title}</span>
              <span
                className={`w-20 h-5 flex items-center justify-center font-normal rounded-full p-3 text-sm ${task.status.toLowerCase() === "closed" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
              >
                {task.status}
              </span>
            </div>

            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center font-normal gap-2 cursor-pointer hover:text-blue-400">
                <span className="text-[#297AD6]">{task.url}</span>
                <ExternalLink size={16} color="#297AD6" strokeWidth={2.75} />
              </div>
              <div className="flex items-center font-normal text-[#64748B]">
                <span>{task.owner}</span>
                <Dot />
                <span>Deadline: {task.date}</span>
                <Dot />
                <span>{task.participants} members participating</span>
              </div>
            </div>
          </CardTitle>
          <div className="flex items-center gap-2 pl-4 pb-4">
            <Coins color="#297AD6" />
            <span className="text-xl text-[#297AD6] font-bold">
              {task.tokens} tokens
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ListCardDetails;
