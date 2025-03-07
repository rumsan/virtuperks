import { PATHS } from "@/routes/paths";
import { Table } from "@tanstack/react-table";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { Coins, Dot, ExternalLink, Timer, Users } from "lucide-react";
import NoTask from "./no.task";

interface TaskPortalCardProps {
  table: Table<any>;
  router: any;
}

const TaskPortalCard = ({ table, router }: TaskPortalCardProps) => {
  const paginatedTasks = table.getRowModel().rows.map((row) => row.original);

  const filteredTasks = paginatedTasks.filter(
    (task) =>
      task.status.toLowerCase() === "open" ||
      task.status.toLowerCase() === "completed",
  );
  return (
    <>
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <Card
            key={task.cuid}
            className="w-full cursor-pointer p-4"
            onClick={() =>
              task.cuid && router.push(PATHS.TASKPORTAL.DETAILS(task.cuid))
            }
          >
            <CardTitle className="flex flex-col gap-1 w-full">
              <div className="flex items-center gap-2">
                <span>{task?.title}</span>
                <span className="w-20 h-6 flex items-center justify-center bg-green-50 rounded-full text-green-700 p-1 text-sm font-normal">
                  {task?.status}
                </span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
                <span className="text-[#297AD6] text-sm font-normal">
                  {task?.url}
                </span>
                <ExternalLink size={16} color="#297AD6" strokeWidth={2.75} />
              </div>
              <div className="flex items-center gap-1 text-sm">
                <div className="flex items-center font-normal text-[#64748B] gap-1">
                  <Users size={18} strokeWidth={2.5} color="#64748B" />
                  <span>{task.participants} members participating</span>
                  <Dot color="#94A3B8" />
                  <Timer size={18} strokeWidth={2.5} color="#64748B" />
                  <span>Deadline: {task.date}</span>
                </div>
                <div className="flex justify-end ml-auto items-center gap-2">
                  <Coins color="#297AD6" />
                  <span className="text-xl text-[#297AD6] font-bold">
                    {task.tokens} tokens
                  </span>
                </div>
              </div>
            </CardTitle>
          </Card>
        ))
      ) : (
        <NoTask />
      )}
    </>
  );
};

export default TaskPortalCard;
