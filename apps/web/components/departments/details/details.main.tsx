"use client";

import { useGetEntityById } from "@/hooks/subgraph/entity";
import { PATHS } from "@/routes/paths";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ArrowLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { useState } from "react";
import DepartmentDetailsCard from "./details.card";
import { useColumns } from "./details.column";
import DepartmentDetailsTable from "./details.table";

export type Cuid = {
  id: string;
};

type DepartmentDetailsProps = {
  cuid: Cuid;
  router: AppRouterInstance;
};

export default function DepartmentDetails({
  cuid,
  router,
}: DepartmentDetailsProps) {
  const { data, isLoading, isError, error } = useGetEntityById(cuid.id);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [activeTab, setActiveTab] = useState<"direct" | "task">("direct");

  const transferColumns = useColumns("transfer");
  const disbursementColumns = useColumns("disbursement");

  if (isLoading) {
    return (
      <main className="gap-2 p-4 sm:px-8 md:gap-8 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-6 w-24" /> {/* Back Button Placeholder */}
        </div>

        <div className="space-y-4">
          <Skeleton className="h-10 w-48" /> {/* Title */}
          <Skeleton className="h-4 w-64" /> {/* Subtitle */}
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))}
          </div>
          <div className="mt-10 mb-6">
            <Skeleton className="h-10 w-64" /> {/* Tabs */}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
          <div className="mt-6">
            <Skeleton className="h-10 w-full" /> {/* Pagination */}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="gap-2 p-4 sm:px-8 md:gap-8">
      <div
        onClick={() => router.push(PATHS.DEPARTMENT.HOME)}
        className="flex items-center gap-2 cursor-pointer hover:text-gray-400"
      >
        <ArrowLeft size={24} strokeWidth={2} />
        <span className="font-base text-gray-700">Back</span>
      </div>
      {isLoading && <p className="text-gray-600">Loading entity details...</p>}
      {isError && (
        <p className="text-red-600">Error loading entity: {error.message}</p>
      )}
      {!isLoading && !isError && (
        <>
          <DepartmentDetailsCard cuid={cuid} router={router} />
          <DepartmentDetailsTable
            cuid={data.rewardManagement}
            setPagination={setPagination}
            pagination={pagination}
            filterTab={activeTab}
            setFilterTab={setActiveTab}
          />
        </>
      )}
    </main>
  );
}
