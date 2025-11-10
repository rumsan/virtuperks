import { formatDate } from "@/utils/formatDate";
import { TaskCreated } from "@workspace/sdk/type";
import { Card, CardTitle } from "@workspace/ui/components/card";
import {
  Coins,
  ExternalLink,
  Timer,
  Trophy,
  UserRoundCog,
  Users,
} from "lucide-react";

type TaskPortalDetailsProps = {
  taskData: TaskCreated;
};

const TaskPortalDetails = ({ taskData }: TaskPortalDetailsProps) => {
  const handleUrlClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Card className="w-[80%] h-full p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <CardTitle className="flex flex-col gap-3 w-full">
          {/* Task Name and Status */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-gray-900">
              {taskData?.taskDetail?.name}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                taskData?.taskDetail.isOpen ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {taskData?.taskDetail.isOpen ? "Open" : "Closed"}
            </span>
          </div>

          {/* Details URL */}
          <div
            className="flex items-center gap-1 cursor-pointer max-w-[280px] group"
            title={taskData?.taskDetail?.detailsUrl}
            onClick={(e) => handleUrlClick(e, taskData?.taskDetail?.detailsUrl)}
          >
            <span className="flex items-center gap-1 border-b-2 border-transparent text-[#297AD6] group-hover:border-[#297AD6] transition-all">
              <span className="font-normal text-lg truncate">
                {taskData?.taskDetail?.detailsUrl || "-"}
              </span>
              <ExternalLink
                size={18}
                color="#297AD6"
                strokeWidth={2.5}
                className="transition-colors"
              />
            </span>
          </div>
        </CardTitle>

        {/* Task Info */}
        <div className="flex flex-col text-gray-600 font-medium gap-2 mt-5 text-base">
          <span className="flex items-center gap-3">
            <UserRoundCog color="#64748B" size={22} strokeWidth={2.5} />
            <span>
              Task Owner:{" "}
              <span className="font-semibold">
                {taskData?.taskDetail?.owner}
              </span>
            </span>
          </span>
          <span className="flex items-center gap-3">
            <Users color="#64748B" size={22} strokeWidth={2.5} />
            <span>
              <span className="font-semibold">
                {taskData?.taskDetail?.maxParticipants}
              </span>{" "}
              members participating
            </span>
          </span>
          <span className="flex items-center gap-3">
            <Timer color="#64748B" size={22} strokeWidth={2.5} />
            <span>
              Deadline:{" "}
              <span className="font-semibold">
                {formatDate(taskData?.taskDetail?.expiryDate)}
              </span>
            </span>
          </span>

          {/* Eligibility Description */}
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-blue-700">Eligibility: </span>
              {taskData?.taskDetail?.isWhitelisted ? (
                <span>
                  Only{" "}
                  <span className="font-semibold">
                    whitelisted participants
                  </span>{" "}
                  can apply.
                </span>
              ) : (
                <span>
                  Open to all{" "}
                  <span className="font-semibold">registered participants</span>{" "}
                  with the participant role.
                </span>
              )}
            </p>
          </div>
        </div>
      </Card>

      <Card className="w-[20%] flex flex-col items-center justify-center ml-auto p-4 gap-3">
        <div className="flex items-center justify-center rounded-full h-10 w-10 bg-blue-50">
          <Trophy color="#297AD6" size={20} />
        </div>
        <div className="flex items-center">
          <Coins color="#297AD6" />
          <span className="text-2xl text-[#297AD6] font-bold ml-2">
            {taskData?.taskDetail?.totalRewardAmount} tokens
          </span>
        </div>
      </Card>
    </>
  );
};

export default TaskPortalDetails;
