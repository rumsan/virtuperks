import { formatDate } from "@/utils/formatDate";
import { TaskCreated } from "@workspace/sdk/type";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { ExternalLink, Timer, Trophy, UserRoundCog, Users } from "lucide-react";

type TaskPortalDetailsProps = {
  taskData: TaskCreated;
};

const TaskPortalDetails = ({ taskData }: TaskPortalDetailsProps) => {
  const handleUrlClick = (
    e: React.MouseEvent<SVGElement | HTMLDivElement, MouseEvent>,
    url: string,
  ) => {
    e.preventDefault();
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <Card className="w-[80%] h-full p-4">
        <CardTitle className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-2">
            <span>{taskData?.taskDetail?.taskName}</span>
            <span className="w-20 h-6 flex items-center justify-center bg-green-50 rounded-full text-green-700 p-1 text-sm font-normal">
              {taskData?.taskDetail?.isActive === true ? `active` : `expired`}
            </span>
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
            <p className="line-clamp-1 font-normal text-[#297AD6] text-sm">
              {taskData?.taskDetail?.detailsUrl}
            </p>
            <ExternalLink
              size={16}
              color="#297AD6"
              strokeWidth={2.75}
              onClick={(e) =>
                handleUrlClick(e, taskData?.taskDetail?.detailsUrl)
              }
            />
          </div>
        </CardTitle>

        <div className="flex flex-col text-gray-500 font-normal gap-1 text-sm mt-4">
          <span className="flex items-center gap-2">
            <UserRoundCog color="#64748B" size={20} strokeWidth={2.5} />
            Task Owner: {taskData?.taskDetail?.owner}
          </span>
          <span className="flex items-center gap-2">
            <Users color="#64748B" size={20} strokeWidth={2.5} />
            {taskData?.taskDetail?.maxParticipants} members participating
          </span>
          <span className="flex items-center gap-2">
            <Timer color="#64748B" size={20} strokeWidth={2.5} /> Deadline:{" "}
            {formatDate(taskData?.taskDetail?.expiryDate)}
          </span>
        </div>
      </Card>

      <Card className="w-[20%] flex flex-col items-center justify-center ml-auto p-4 gap-3">
        <div className="flex items-center justify-center rounded-full h-10 w-10 bg-blue-50">
          <Trophy color="#297AD6" size={20} />
        </div>
        <span className="text-2xl text-[#297AD6] font-bold">
          {taskData?.taskDetail?.rewardAmount} tokens
        </span>
      </Card>
    </>
  );
};

export default TaskPortalDetails;
