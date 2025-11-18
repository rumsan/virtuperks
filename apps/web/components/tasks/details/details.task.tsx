import { formatDate } from "@/utils/formatDate";
import { Card, CardTitle } from "@workspace/ui/components/card";
import {
  Building2,
  ExternalLink,
  Timer,
  Trophy,
  UserRoundCog,
  Users,
} from "lucide-react";

type TaskDetailsProps = {
  taskData: any;
};

const TaskDetails = ({ taskData }: TaskDetailsProps) => {
  console.log(taskData, "taskData in details component");
  const formattedDate = formatDate(taskData?.taskDetail?.expiryDate);
  const handleUrlClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const isWhiteListed = taskData?.taskDetail?.isWhitelisted;

  return (
    <>
      <Card className="w-[80%] h-full p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <CardTitle className="flex flex-col gap-4 w-full">
          {/* Title and Status */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-[#1E293B]">
              {taskData?.taskDetail?.name}
            </span>
            <span
              className={`px-3 py-1 rounded text-white text-sm font-semibold ${
                taskData?.taskDetail?.isOpen ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {taskData?.taskDetail?.isOpen ? "Open" : "Closed"}
            </span>
          </div>

          {/* Details URL */}
          <div
            className="flex items-center gap-2 max-w-[300px] truncate text-base group cursor-pointer"
            onClick={() =>
              taskData?.taskDetail?.detailsUrl &&
              window.open(taskData.taskDetail.detailsUrl, "_blank")
            }
          >
            <span
              className="text-[#297AD6] truncate border-b-2 border-transparent group-hover:border-[#297AD6] transition-all"
              title={taskData?.taskDetail?.detailsUrl}
            >
              {taskData?.taskDetail?.detailsUrl
                ? taskData.taskDetail.detailsUrl.length > 50
                  ? `${taskData.taskDetail.detailsUrl.slice(0, 50)}...`
                  : taskData.taskDetail.detailsUrl
                : ""}
            </span>
            <ExternalLink
              size={20}
              color="#297AD6"
              strokeWidth={2}
              className="flex-shrink-0 text-[#297AD6] group-hover:text-[#297AD6] transition-colors"
            />
          </div>
        </CardTitle>

        {/* Task Info */}
        <div className="flex flex-col text-gray-600 font-medium gap-2 mt-4 text-base">
          <span className="flex items-center gap-3">
            <UserRoundCog color="#64748B" size={22} strokeWidth={2.5} />
            Task Owner:{" "}
            <span className="font-semibold">{taskData?.taskDetail?.owner}</span>
          </span>
          <span className="flex items-center gap-3">
            <Users color="#64748B" size={22} strokeWidth={2.5} />
            <span className="font-semibold">
              {taskData?.taskDetail?.maxParticipants}
            </span>{" "}
            members participating
          </span>
          <span className="flex items-center gap-3">
            <Timer color="#64748B" size={22} strokeWidth={2.5} /> Deadline:{" "}
            <span className="font-semibold">{formattedDate}</span>
          </span>
          <span className="flex items-center gap-3">
            <Building2 color="#64748B" size={22} strokeWidth={2.5} />{" "}
            Department:{" "}
            <span className="font-semibold">
              {taskData?.rewardManagement?.name || "N/A"}
            </span>
          </span>

          {/* Eligibility Description */}
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-blue-700">Eligibility: </span>
              {isWhiteListed ? (
                <span>
                  Only{" "}
                  <span className="font-semibold">
                    whitelisted participants
                  </span>{" "}
                  can participate.
                </span>
              ) : (
                <span>
                  Anyone with the{" "}
                  <span className="font-semibold">participant role</span> can
                  participate.
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
        <span className="text-2xl text-[#297AD6] font-bold">
          {taskData?.taskDetail?.totalRewardAmount} Tokens
        </span>
      </Card>
    </>
  );
};

export default TaskDetails;
