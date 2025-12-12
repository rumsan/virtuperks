"use client";

import { useGetAllEntity } from "@/hooks/subgraph/entity";
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
// import TokenCreate from "../form/token.create";

interface TokenCreateMainProps {
  router: AppRouterInstance;
  id: { id: string };
}

export default function TokenCreateMain({ router, id }: TokenCreateMainProps) {
  const { data } = useGetAllEntity();
  const departmentList = data?.data?.entityTaskManagerCreateds || [];

  const department: DepartmentDetails | undefined = departmentList.find(
    (dept: DepartmentDetails) => dept.id === id.id,
  );

  return (
    <main className="gap-2 p-4 sm:px-8 md:gap-8 w-full">
      <div
        className="w-[170px] flex justify-center items-center gap-2 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          history.back();
        }}
      >
        <ArrowLeft size={24} strokeWidth={2} />
        <span className="font-base text-gray-700">Back</span>
      </div>

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
            <CardDescription />
          </CardHeader>
          {/* <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            {department?.entityTaskManager?.entityTaskManager
              ? `${department.entityTaskManager.entityTaskManager.slice(0, 10)}...${department.entityTaskManager.entityTaskManager.slice(-6)}`
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
            <CardDescription />
          </CardHeader>
          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            {"0"}
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
            <CardDescription />
          </CardHeader>
          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            {"0"}
          </CardFooter>
        </Card>

        <Card className="font-normal text-base h-40 flex flex-col w-full h-full">
          <CardHeader className="flex-grow">
            <CardTitle className="flex items-center justify-between p-0 mb-4">
              <span className="text-[#0F172A] tracking-wide">Group</span>
              <Folders />
            </CardTitle>
            <CardDescription />
          </CardHeader>
          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            {department?.name}
          </CardFooter>
        </Card>
      </div>

      {/* <TokenCreate router={router} id={id} /> */}
    </main>
  );
}
