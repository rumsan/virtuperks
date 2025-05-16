import { useEntityList } from "@/hooks/subgraph/querycall";
import { DepartmentDetails } from "@workspace/sdk/type";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ArrowLeft, Coins, Folders, User } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import TokenAllocateForm from "./token.allocate";

interface TokenCreateMainProps {
  router: AppRouterInstance;
  id: { id: string };
}

const TokenCreateMain = ({ router, id }: TokenCreateMainProps) => {
  const getAllEntity = useEntityList();
  const departmentList =
    getAllEntity?.data?.data?.entityTaskManagerCreateds || [];

  // Find the department by id
  const department: DepartmentDetails | undefined = departmentList.find(
    (dept: DepartmentDetails) => dept.id === id.id,
  );

  return (
    <main className="gap-2 p-4 sm:px-8 md:gap-8 w-full">
      <div
        className="w-[170px] flex justify-center items-center gap-2 cursor-pointer"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.preventDefault();
          history.back();
        }}
      >
        <ArrowLeft size={24} strokeWidth={2} />
        <span className="font-base text-gray-700">Back</span>
      </div>

      {/* <div
        onClick={() => router.push(PATHS.TREASURER.HOME)}
        className="flex items-center gap-2 cursor-pointer hover:text-gray-400 "
      >
        <ArrowLeft size={24} strokeWidth={2} />
        <span className="font-base text-gray-700">Back</span>
      </div> */}
      <div className="flex flex-col gap-1 my-2">
        <h1 className="font-bold text-4xl">Create Token</h1>
        <h3 className="text-gray-500 font-normal text-sm">
          Fill the form below to create token details
        </h3>
      </div>

      <div className="grid grid-cols-4 mt-4 gap-4 w-full">
        <Card className="font-normal text-base h-40 flex flex-col w-full h-full">
          <CardHeader className="flex-grow">
            <CardTitle className="flex items-center p-0 mb-4">
              <span className="text-[#0F172A] tracking-wide">
                Department Owner
              </span>
              <User className="ml-auto" />
            </CardTitle>
            <CardDescription className="flex items-center text-sm">
              <div className="h-4"></div>
            </CardDescription>
          </CardHeader>
          {/* <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            {department?.entityTaskManager?.entityTaskManager
              ? `${department.entityTaskManager.entityTaskManager.slice(0, 10)} . . . ${department.entityTaskManager.entityTaskManager.slice(-6)}`
              : ""}
          </CardFooter> */}
        </Card>

        <Card className="font-normal text-base h-40 flex flex-col w-full h-full">
          <CardHeader className="flex-grow">
            <CardTitle className="flex items-center justify-between p-0 mb-4">
              <span className="text-[#0F172A] tracking-wide">
                Overall tokens allocated
              </span>
              <Coins />
            </CardTitle>
            <CardDescription className="flex items-center text-sm">
              <div className="h-4"></div>
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            {department?.totalTokenBalance}
          </CardFooter>
        </Card>

        <Card className="font-normal text-base h-40 flex flex-col w-full h-full">
          <CardHeader className="flex-grow">
            <CardTitle className="flex items-center justify-between p-0 mb-4">
              <span className="text-[#0F172A] tracking-wide">
                Available tokens
              </span>
              <Coins />
            </CardTitle>
            <CardDescription className="flex items-center text-sm">
              <div className="h-4"></div>
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            {department?.remainingBalance}
          </CardFooter>
        </Card>

        <Card className="font-normal text-base h-40 flex flex-col w-full h-full">
          <CardHeader className="flex-grow">
            <CardTitle className="flex items-center justify-between p-0 mb-4">
              <span className="text-[#0F172A] tracking-wide">Group</span>
              <Folders />
            </CardTitle>
            <CardDescription className="flex items-center text-sm">
              <div className="h-4"></div>
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            {department?._name}
          </CardFooter>
        </Card>
      </div>

      <TokenAllocateForm router={router} id={id} />
    </main>
  );
};

export default TokenCreateMain;
