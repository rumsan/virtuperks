import { Cuid } from "@/components/departments/details/details.main";
import { useGetAllowedWallets, useTaskList } from "@/hooks/subgraph/querycall";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { ExternalLink, Timer, Trophy, UserRoundCog, Users } from "lucide-react";

type TaskPortalDetailsProps = {
  cuid: Cuid;
};

const TaskPortalDetails = ({ cuid }: TaskPortalDetailsProps) => {
  const getAllTask = useTaskList();

  const TaskList = getAllTask?.data?.data?.taskCreateds;
  console.log(TaskList, 'TaskList');  

  // const filteredTasks = TaskList?.filter((task) => {
  //   return task?.taskDetail;
  // }).map((task) => task.taskDetail);

  const taskData = TaskList?.find((task) => task.id === cuid.id); 

  
  const { data: allowedWallet, isLoading: isLoadingWallets } = useGetAllowedWallets(taskData?.id, taskData?.entityTaskManager.id);
  console.log(allowedWallet, 'allowedWallet');
  

  return (
    <>
      <Card className="w-[80%] h-full p-4">
        <CardTitle className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-2">
            <span>Organize a blood donation campaign</span>
            <span className="w-20 h-6 flex items-center justify-center bg-green-50 rounded-full text-green-700 p-1 text-sm font-normal">
              {taskData?.isActive === true ? `active` : `expired`}
            </span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-blue-400">
            <span className="text-[#297AD6] text-sm font-normal">
              View Github repository
            </span>
            <ExternalLink size={16} color="#297AD6" strokeWidth={2.75} />
          </div>

          <div className="w-full overflow-hidden">
            <p className="text-[#334155] text-sm line-clamp-1 font-normal">
              {taskData?.detailsUrl}
            </p>
          </div>
        </CardTitle>

        <div className="flex flex-col text-gray-500 font-normal gap-1 text-sm mt-4">
          <span className="flex items-center gap-2">
            <UserRoundCog color="#64748B" size={20} strokeWidth={2.5} />
            Task Owner: {taskData?.owner}
          </span>
          <span className="flex items-center gap-2">
            <Users color="#64748B" size={20} strokeWidth={2.5} />
            {taskData?.maxParticipants} members participating
          </span>
          <span className="flex items-center gap-2">
            <Timer color="#64748B" size={20} strokeWidth={2.5} /> Deadline:{" "}
            {taskData?.expiryDate}
          </span>
        </div>
      </Card>

      <Card className="w-[20%] flex flex-col items-center justify-center ml-auto p-4 gap-3">
        <div className="flex items-center justify-center rounded-full h-10 w-10 bg-blue-50">
          <Trophy color="#297AD6" size={20} />
        </div>
        <span className="text-2xl text-[#297AD6] font-bold">
          {taskData?.rewardAmount} tokens
        </span>
      </Card>
    </>
  );
};

export default TaskPortalDetails;
