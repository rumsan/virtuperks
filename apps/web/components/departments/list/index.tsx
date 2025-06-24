"use client";

import { useGetAllEntity } from "@/hooks/subgraph/entity";
import { DepartmentDetails } from "@workspace/sdk/type";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import DepartmentListCard from "./list.card";
import ListToolBar from "./list.toolbar";

interface DepartmentListProps {
  router: AppRouterInstance;
}

export default function DepartmentList({ router }: DepartmentListProps) {
  const getAllEntity = useGetAllEntity();
  const isLoading = getAllEntity.isLoading;
  const entityList: DepartmentDetails[] =
    getAllEntity?.data?.data?.rewardManagementCreateds || [];

  if (isLoading) {
    return (
      <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full flex flex-col">
        <div className="space-y-4 flex-grow">
          <div className="flex flex-col gap-1 my-3">
            <Skeleton className="h-10 w-48" /> {/* Title skeleton */}
            <Skeleton className="h-4 w-64" /> {/* Subtitle skeleton */}
          </div>

          <div className="mb-4">
            <Skeleton className="h-10 w-full" /> {/* Toolbar skeleton */}
          </div>

          <div className="grid grid-cols-4 mt-1 gap-4 w-full">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" /> // Department cards skeleton
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full">
      <div className="space-y-4">
        <div className="flex flex-col gap-1 my-3">
          <h1 className="font-bold text-4xl">Department</h1>
          <h3 className="text-gray-500 font-normal text-sm">
            Overview of all the departments
          </h3>
        </div>
        <ListToolBar />
        <DepartmentListCard router={router} entityList={entityList} />
      </div>
    </main>
  );
}
