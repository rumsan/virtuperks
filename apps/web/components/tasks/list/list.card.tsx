import { PATHS } from "@/routes/paths";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { Coins, Dot, ExternalLink } from "lucide-react";
import { Task } from "../form/schema";

type ListCardDetailsProps = {
  taskList: Task[];
  router: AppRouterInstance;
  tabStatus: string;
};

const ListCardDetails = ({
  taskList,
  router,
  tabStatus,
}: ListCardDetailsProps) => {
  const filteredTaskList = () => {
    if (!taskList || !Array.isArray(taskList)) {
      return [];
    }

    if (tabStatus === "active") {
      return taskList?.filter((task) => {
        return task?.taskDetail?.isActive === true;
      });
    } else if (tabStatus === "completed") {
      return taskList?.filter((task) => task?.taskDetail?.isActive === false);
    }
    return taskList;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {filteredTaskList().map(
        (task) => (
          console.log(task, "task in body"),
          (
            <Card
              key={task?.id}
              className="cursor-pointer"
              onClick={() =>
                task?.id && router.push(PATHS.TASKS.DETAILS(task?.id))
              }
            >
              <CardTitle className="flex flex-col p-4 gap-2">
                <div className="flex items-center gap-2 text-[#334155]">
                  <span>Default Title</span>
                  <span
                    className={`w-20 h-5 flex items-center justify-center font-normal rounded-full p-3 text-sm 
                  `}
                  >
                    {task?.taskDetail?.isActive}
                  </span>
                </div>

                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex items-center font-normal gap-2 cursor-pointer hover:text-blue-400">
                    <span className="text-[#297AD6]">
                      {task?.taskDetail?.detailsUrl}
                    </span>
                    <ExternalLink
                      size={16}
                      color="#297AD6"
                      strokeWidth={2.75}
                    />
                  </div>
                  <div className="flex items-center font-normal text-[#64748B]">
                    <span>{task?.taskDetail?.owner}</span>
                    <Dot />
                    <span>Deadline: {task?.taskDetail?.expiryDate}</span>
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
                  {task?.taskDetail?.rewardAmount} tokens
                </span>
              </div>
            </Card>
          )
        ),
      )}
    </div>
  );
};

export default ListCardDetails;
