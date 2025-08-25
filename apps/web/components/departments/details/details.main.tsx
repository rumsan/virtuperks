"use client";

import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import { useGetEntityById } from "@/hooks/subgraph/entity";
import { PATHS } from "@/routes/paths";
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
      <LoaderSkeleton
        backButton
        title
        titleWidth="w-40"
        subtitle
        subtitleWidth="w-64"
        showTabs
        tabsCount={2}
        cardCount={4}
        gridCols="grid-cols-4"
        cardHeight="h-48"
        tableSkeleton
        tableHeight="h-60"
        showPagination
      />
    );
  }

  return (
    <main className="gap-2 p-4 sm:px-8 md:gap-8">
      <button
        onClick={() => router.push(PATHS.DEPARTMENT.HOME)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 hover:text-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <span className="text-lg">&larr;</span>
        <span>Back to Departments</span>
      </button>
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
