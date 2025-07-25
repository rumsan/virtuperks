import { useGetAllEntity } from "@/hooks/subgraph/entity";
import { PATHS } from "@/routes/paths";
import hasRole from "@/utils/role";
import { DepartmentDetails } from "@workspace/sdk/type";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@workspace/ui/components/card";
import { ArrowRight, Coins, Plus, User } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DepartmentListCardProps {
  router: AppRouterInstance;
  entityList: DepartmentDetails[];
}

const DepartmentListCard = ({ router }: DepartmentListCardProps) => {
  const getAllEntity = useGetAllEntity();

  const entityList = getAllEntity?.data?.data?.rewardManagementCreateds;


  return (
    <div className="grid grid-cols-4 gap-4 w-full p-4">
      <Card
        className="w-full flex items-center justify-center text-blue-500 bg-blue-50 border-sm border-primary border-dashed cursor-pointer hover:shadow-lg hover:text-blue-400"
        onClick={() => router.push(PATHS.DEPARTMENT.ADD)}
      >
        <span className="text-center text-base">Add Department</span>
        <Plus size={24} />
      </Card>

      {entityList &&
        entityList.map((department: DepartmentDetails) => {
          return (
            <Card
              key={department.id}
              className="cursor-pointer hover:shadow-lg p-4"
              onClick={() =>
                router.push(PATHS.DEPARTMENT.DETAILS(department.entityId))
              }
            >
              <CardTitle className="flex text-base">
                <span className="text-[#334155]">{department.name}</span>

                <span className="ml-auto w-[90px] flex items-center justify-center bg-[#F1F5F9] rounded-xl font-normal text-[#334155] text-sm">
                  {department.name}
                </span>
              </CardTitle>
              <CardDescription className="flex gap-2 text-sm">
                <User size={20} strokeWidth={2.75} />
                <span>{department.name}</span>
              </CardDescription>
              <div className="flex flex-col mr-auto gap-2 p-0 font-normal">
                {/* <span className="flex text-[#64748B] mt-5">
                  Available Tokens:
                </span> */}
                <div className="flex items-center justify-start">
                  <div className="flex items-center text-[#297AD6] gap-2">
                    <Coins size={20} strokeWidth={2.5} color="#297AD6" />
                    <span className="text-2xl font-bold">
                      {department.totalAvailableTokens}
                    </span>
                  </div>
                  <div className="flex items-center ml-auto gap-2">
                    <span className="text-[#297AD6]">View details</span>
                    <ArrowRight size={24} strokeWidth={2} color="#297AD6" />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
    </div>
  );
};

export default DepartmentListCard;
