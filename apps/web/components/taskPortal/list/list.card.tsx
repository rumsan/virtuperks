import { PATHS } from "@/routes/paths";
import { formatDate } from "@/utils/formatDate";
import { Tasks } from "@workspace/sdk/type";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { Coins, Dot, ExternalLink, Timer, Users } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import NoTask from "./no.task";

interface TaskPortalCardProps {
  data: Tasks[];
  router: AppRouterInstance;
}

const TaskPortalCard = ({ data, router }: TaskPortalCardProps) => {
  const handleUrlClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {data.length > 0 ? (
        data.map((task) => (
          <Card
            key={task.id}
            className="w-full cursor-pointer p-4"
            onClick={() =>
              task.id && router.push(PATHS.TASKPORTAL.DETAILS(task.id))
            }
          >
            <CardTitle className="flex flex-col gap-1 w-full">
              <div className="flex items-center gap-2">
                <span>{task.taskDetail.name}</span>
                <span className="w-20 h-6 flex items-center justify-center bg-green-50 rounded-full text-green-700 p-1 text-sm font-normal">
                  {task?.taskDetail.isOpen === true ? `active` : `closed`}
                </span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
                <span className="text-[#297AD6] text-sm font-normal">
                  {task?.taskDetail.detailsUrl}
                </span>
                <ExternalLink
                  size={16}
                  color="#297AD6"
                  strokeWidth={2.75}
                  onClick={(e) =>
                    handleUrlClick(e, task?.taskDetail.detailsUrl)
                  }
                />
              </div>
              <div className="flex items-center gap-1 text-sm">
                <div className="flex items-center font-normal text-[#64748B] gap-1">
                  <Users size={18} strokeWidth={2.5} color="#64748B" />
                  <span>
                    {task?.taskDetail.maxParticipants} members participating
                  </span>
                  <Dot color="#94A3B8" />
                  <Timer size={18} strokeWidth={2.5} color="#64748B" />
                  <span>
                    Deadline: {formatDate(task?.taskDetail.expiryDate)}
                  </span>
                </div>
                <div className="flex justify-end ml-auto items-center gap-2">
                  <Coins color="#297AD6" />
                  <span className="text-xl text-[#297AD6] font-bold">
                    {task?.taskDetail.rewardAmount} tokens
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
