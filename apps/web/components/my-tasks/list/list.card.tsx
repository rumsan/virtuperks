import { PATHS } from "@/routes/paths";
import { formatDate } from "@/utils/formatDate";
import { Table } from "@tanstack/react-table";
import { TaskCreated } from "@workspace/sdk/type";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { Coins, Dot, ExternalLink, Timer, Users } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import NoTask from "./no.task";

interface TaskPortalCardProps<TData> {
  table: Table<TData>;
  router: AppRouterInstance;
}

const TaskPortalCard = <TData,>({
  table,
  router,
}: TaskPortalCardProps<TData>) => {
  const paginatedTasks = table.getRowModel().rows.map((row) => row.original);
  console.log("Paginated: ", paginatedTasks);

  const filteredTasks = paginatedTasks.filter(
    (task) => (task as TaskCreated)?.taskDetail,
  ) as TaskCreated[];

  return (
    <>
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <Card
            key={task.taskDetail.id}
            className="w-full cursor-pointer p-4"
            onClick={() =>
              task.taskDetail.id &&
              router.push(PATHS.TASKPORTAL.DETAILS(task.taskDetail.id))
            }
          >
            <CardTitle className="flex flex-col gap-1 w-full">
              <div className="flex items-center gap-2">
                <span>{task.taskDetail.name}</span>
                <span className="w-20 h-6 flex items-center justify-center bg-green-50 rounded-full text-green-700 p-1 text-[10px] font-bold">
                  {task.status}
                </span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
                <span className="text-[#297AD6] text-sm font-normal">
                  {task.taskDetail.detailsUrl}
                </span>
                <ExternalLink size={16} color="#297AD6" strokeWidth={2.75} />
              </div>
              <div className="flex items-center gap-1 text-sm">
                <div className="flex items-center font-normal text-[#64748B] gap-1">
                  <Users size={18} strokeWidth={2.5} color="#64748B" />
                  <span>
                    {task.taskDetail.maxParticipants} members participating
                  </span>
                  <Dot color="#94A3B8" />
                  <Timer size={18} strokeWidth={2.5} color="#64748B" />
                  <span>
                    Deadline: {formatDate(task.taskDetail.expiryDate)}
                  </span>
                </div>
                <div className="flex justify-end ml-auto items-center gap-2">
                  <Coins color="#297AD6" />
                  <span className="text-xl text-[#297AD6] font-bold">
                    {task.taskDetail.totalRewardAmount} tokens
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
