import { useGetAllEntity } from "@/hooks/subgraph/entity";
import { PATHS } from "@/routes/paths";
import hasRole from "@/utils/role";
import { DepartmentDetails } from "@workspace/sdk/type";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { ArrowRight, Building, Plus } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DepartmentListCardProps {
  router: AppRouterInstance;
  entityList: DepartmentDetails[];
}

const DepartmentListCard = ({ router }: DepartmentListCardProps) => {
  const getAllEntity = useGetAllEntity();
  const entityList = getAllEntity?.data?.data?.rewardManagementCreateds;
  const hasEntityOwnerRole = hasRole({
    role: process.env.NEXT_PUBLIC_DEFAULT_ADMIN_ROLE || "",
  });

  const canAddDepartment = Boolean(hasEntityOwnerRole);

  return (
    <div className="grid grid-cols-4 gap-4 w-full p-4">
      {canAddDepartment && (
        <Card
          className="w-full flex items-center justify-center text-blue-500 bg-blue-50 border-sm border-primary border-dashed cursor-pointer hover:shadow-lg hover:text-blue-400"
          onClick={() => router.push(PATHS.DEPARTMENT.ADD)}
        >
          <span className="text-xl font-bold text-blue-500">
            Add Department
          </span>

          <Plus size={24} />
        </Card>
      )}

      {entityList &&
        entityList.map((department: DepartmentDetails) => {
          return (
            <Card
              key={department.id}
              className="cursor-pointer hover:shadow-lg p-6 rounded-2xl border border-slate-200 transition-all duration-200 group"
              onClick={() =>
                router.push(PATHS.DEPARTMENT.DETAILS(department.entityId))
              }
            >
              {/* Department Header */}
              <CardTitle className="flex items-center gap-4 text-lg font-semibold text-[#0F172A]">
                <div className="p-3 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Building
                    size={36}
                    strokeWidth={2}
                    className="text-[#297AD6]"
                  />
                </div>
                <span className="truncate text-xl font-bold text-slate-800">
                  {department.name}
                </span>
              </CardTitle>

              {/* Footer */}
              <div className="flex items-center justify-end mt-6 text-[#297AD6] font-medium group-hover:translate-x-1 transition-transform">
                <span>View details</span>
                <ArrowRight size={20} strokeWidth={2.25} />
              </div>
            </Card>
          );
        })}
    </div>
  );
};

export default DepartmentListCard;
