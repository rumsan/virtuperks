import { formatDate } from "@/utils/formatDate";
import { TaskCreated } from "@workspace/sdk/type";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { Coins, Dot } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect } from "react";

type ListCardDetailsProps = {
  taskList: TaskCreated[];
  router: AppRouterInstance;
  tabStatus: string;
};

const ListCardDetails = ({
  taskList,
  router,
  tabStatus,
}: ListCardDetailsProps) => {
  
  const allTasks = Array.isArray(taskList) ? taskList : [];

  
  useEffect(() => {
    if (allTasks.length > 0) {
      console.log("📋 All Task Statuses:");
      allTasks.forEach((task) => {
        console.log({
          id: task?.id,
          name: task?.taskDetail?.name,
          isOpen: task?.taskDetail?.isOpen,
          isTokenDisbursed: task?.taskDetail?.isTokenDisbursed,
          expiryDate: task?.taskDetail?.expiryDate,
        });
      });
    } else {
      console.log("⚠️ No tasks available to display.");
    }
  }, [allTasks]);

  const handleUrlClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid grid-cols-2 gap-4 overflow-visible">
      {allTasks.map((task) => (
        <Card
          key={task?.id}
          className="cursor-pointer"
          // onClick={() => task?.id && router.push(PATHS.TASKS.DETAILS(task?.id))}
        >
          <CardTitle className="flex flex-col p-4 gap-2">
            <div className="flex items-center gap-2 text-[#334155]">
              <span>{task?.taskDetail?.name}</span>
            </div>

            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center font-normal gap-2 cursor-pointer hover:text-blue-400">
                <span
                  className="text-[#297AD6] truncate max-w-[200px]"
                  title={task?.taskDetail?.detailsUrl}
                  onClick={(e) =>
                    handleUrlClick(e, task?.taskDetail?.detailsUrl ?? "")
                  }
                >
                  {task?.taskDetail?.detailsUrl
                    ? task.taskDetail.detailsUrl.length > 40
                      ? `${task.taskDetail.detailsUrl.slice(0, 40)}...`
                      : task.taskDetail.detailsUrl
                    : ""}
                </span>
              </div>

              <div className="flex items-center font-normal text-[#64748B]">
                <span>
                  {task?.taskDetail?.owner
                    ? `${task.taskDetail.owner.slice(0, 15)}.. . . ${task.taskDetail.owner.slice(-10)}`
                    : ""}
                </span>
                <Dot />
                <span>
                  Deadline: {formatDate(task?.taskDetail?.expiryDate)}
                </span>
                <Dot />
                <span>
                  {task?.taskDetail?.maxParticipants} members participating
                </span>
              </div>
            </div>
          </CardTitle>
          <div className="flex items-center gap-2 pl-4 pb-4">
            <Coins color="#297AD6" />
            <span className="text-xl text-[#297AD6] font-bold">
              {task?.taskDetail?.totalRewardAmount} tokens
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ListCardDetails;
