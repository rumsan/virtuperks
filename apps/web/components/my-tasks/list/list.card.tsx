import { PATHS } from "@/routes/paths";
import { formatDate } from "@/utils/formatDate";
import { Table } from "@tanstack/react-table";
import { TaskDetail } from "@workspace/sdk/type";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { Coins, Dot, ExternalLink, Timer, Users } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import NoTask from "./no.task";

const StatusBadge = ({ status }: { status?: string }) => {
  const getStatusProps = (status?: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          bg: "bg-[#03AB65]",
          text: "text-[#F8FAFC]",
          label: "Task Completed",
        };
      case "ACCEPTED":
        return {
          bg: "bg-[#297AD6]",
          text: "text-[#F8FAFC]",
          label: "Mark as Completed",
        };
      case "UNACCEPTED":
        return {
          bg: "bg-[#F59E0B]",
          text: "text-[#F8FAFC]",
          label: "Waiting for Approval",
        };
      default:
        return {
          bg: "bg-[#297AD6]",
          text: "text-[#F8FAFC]",
          label: "Apply for Task",
        };
    }
  };

  const { bg, text, label } = getStatusProps(status);

  return (
    <span
      className={`w-40 h-9 flex items-center justify-center rounded-full p-1 text-sm font-normal ${bg} ${text}`}
    >
      {label}
    </span>
  );
};

const ActivityBadge = ({ isActive }: { isActive?: boolean }) => {
  return (
    <span
      className={`w-20 h-6 flex items-center justify-center rounded-full p-1 text-sm font-normal ${
        isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      }`}
    >
      {isActive ? "active" : "expired"}
    </span>
  );
};

export interface TaskWithDetail {
  taskDetail: TaskDetail;
  status?: string;
  id: string;
}

interface TaskPortalCardProps<TData extends TaskWithDetail> {
  table: Table<TData>;
  router: AppRouterInstance;
}

const TaskPortalCard = <TData extends TaskWithDetail>({
  table,
  router,
}: TaskPortalCardProps<TData>) => {
  const paginatedTasks = table.getRowModel().rows.map((row) => row.original);

  return (
    <>
      {paginatedTasks.length > 0 ? (
        paginatedTasks.map((task) => (
          <Card
            key={task.id}
            className="w-full cursor-pointer p-4"
            onClick={() =>
              task.taskDetail?.id &&
              router.push(PATHS.TASKPORTAL.DETAILS(task.taskDetail?.id))
            }
          >
            <CardTitle className="flex flex-col gap-1 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base">
                    {task.taskDetail?.taskName}
                  </span>
                  <ActivityBadge isActive={task.taskDetail?.isActive} />
                </div>
                <StatusBadge status={task.status} />
              </div>

              <div className="flex items-center gap-2 mt-1 cursor-pointer hover:text-blue-400">
                <span className="text-[#297AD6] text-sm font-normal truncate max-w-[85%]">
                  {task.taskDetail?.detailsUrl}
                </span>
                <ExternalLink size={16} color="#297AD6" strokeWidth={2.75} />
              </div>

              <div className="flex items-center gap-1 text-sm mt-1">
                <div className="flex items-center font-normal text-[#64748B] gap-1 flex-wrap">
                  <Users size={18} strokeWidth={2.5} color="#64748B" />
                  <span>
                    {task.taskDetail?.maxParticipants} members participating
                  </span>
                  <Dot color="#94A3B8" />
                  <Timer size={18} strokeWidth={2.5} color="#64748B" />
                  <span>
                    Deadline: {formatDate(task.taskDetail?.expiryDate)}
                  </span>
                </div>

                <div className="flex justify-end ml-auto items-center gap-2">
                  <Coins color="#297AD6" />
                  <span className="text-xl text-[#297AD6] font-bold">
                    {task.taskDetail?.rewardAmount} tokens
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
