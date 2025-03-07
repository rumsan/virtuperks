import { useEntityList } from "@/hooks/subgraph/querycall";
import { PATHS } from "@/routes/paths";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ArrowRight, Plus, User } from "lucide-react";

const DepartmentListCard = ({ router }: any) => {
  // const listOftheDepartments = useEntity();
  const getAllEntity = useEntityList()
  const entityList = getAllEntity?.data?.data?.entityTaskManagerCreateds

  
  
  

  return (
    <div className="flex items-center w-full">
      <div className="grid grid-cols-4 gap-4 w-full">
        <Card
          className="w-full flex items-center justify-center text-blue-500 bg-blue-50 border-sm border-primary border-dashed cursor-pointer hover:shadow-lg hover:text-blue-400"
          onClick={() => router.push(PATHS.DEPARTMENT.ADD)}
        >
          <span className="text-center text-base">Add Department</span>
          <Plus size={24} />
        </Card>
        {entityList &&
          entityList.map((department:any) => {
            return (
              <Card
                key={department.id}
                className="cursor-pointer hover:shadow-lg"
                onClick={() =>
                  router.push(PATHS.DEPARTMENT.DETAILS(department.cuid))
                }
              >
                <CardHeader>
                  <CardTitle className="text-base flex ">
                    {department._name}
                    <span className="ml-auto w-[90px] flex items-center justify-center bg-gray-100 rounded-xl font-normal text-sm">
                      {/* {department._app} */}
                    </span>
                  </CardTitle>
                  <CardDescription className="flex gap-2 text-sm">
                    <User size={20} strokeWidth={2.75} />
                    <span>{department._name}</span>
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-end gap-2 text-blue-500 font-normal">
                  <div className="flex items-center justify-center">
                    <span>View details</span>
                    <ArrowRight size={24} strokeWidth={2} />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default DepartmentListCard;
