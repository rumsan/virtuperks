import { PATHS } from "@/routes/paths";
import { Table } from "@tanstack/react-table";
import { TaskCreated } from "@workspace/sdk/type";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { Coins, Dot, ExternalLink, Timer, Users } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import NoTask from "./no.task";
import { formatDate } from "@/utils/formatDate";

interface TaskPortalCardProps<TData> {
  table: Table<TData>;
  router: AppRouterInstance;
}

const TaskPortalCard = <TData,>({
  table,
  router,
}: TaskPortalCardProps<TData>) => {
  const paginatedTasks = table.getRowModel().rows.map((row) => row.original);

  const filteredTasks = paginatedTasks
    ?.filter((task) => {
      return (task as TaskCreated)?.taskDetail;
    })
      .map((task) => (task as TaskCreated)?.taskDetail);
  

  return (
    <>
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <Card
            key={task.id}
            className="w-full cursor-pointer p-4"
            onClick={() =>
              task.id && router.push(PATHS.TASKPORTAL.DETAILS(task.id))
            }
          >
            <CardTitle className="flex flex-col gap-1 w-full">
              <div className="flex items-center gap-2">
                        <span>{ task?.taskName}</span>
                <span className="w-20 h-6 flex items-center justify-center bg-green-50 rounded-full text-green-700 p-1 text-sm font-normal">
                  {task?.isActive === true ? `active` : `expired`}
                </span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
                <span className="text-[#297AD6] text-sm font-normal">
                  {task?.detailsUrl}
                </span>
                <ExternalLink size={16} color="#297AD6" strokeWidth={2.75} />
              </div>
              <div className="flex items-center gap-1 text-sm">
                <div className="flex items-center font-normal text-[#64748B] gap-1">
                  <Users size={18} strokeWidth={2.5} color="#64748B" />
                  <span>{task?.maxParticipants} members participating</span>
                  <Dot color="#94A3B8" />
                  <Timer size={18} strokeWidth={2.5} color="#64748B" />
                  <span>Deadline: {formatDate(task?.expiryDate)}</span>
                </div>
                <div className="flex justify-end ml-auto items-center gap-2">
                  <Coins color="#297AD6" />
                  <span className="text-xl text-[#297AD6] font-bold">
                    {task?.rewardAmount} tokens
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
