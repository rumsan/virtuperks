"use client";

import { useGetEntityById } from "@/hooks/subgraph/entity";
import { PATHS } from "@/routes/paths";
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

  const [activeTab, setActiveTab] = useState<"direct" | "task">("direct");

  const transferColumns = useColumns("transfer");
  const disbursementColumns = useColumns("disbursement");

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

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
            cuid={cuid}
            pagination={pagination}
            setPagination={setPagination}
            filterTab={activeTab}
            setFilterTab={setActiveTab}
          />
        </>
      )}
    </main>
  );
}
