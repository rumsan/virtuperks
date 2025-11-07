"use client";

import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import {
  useCheckTotalAllocatedTokens,
  useCheckTotalUnallocatedTokens,
  useGetEntityById,
  useGetEntityOwners,
} from "@/hooks/subgraph/entity";
import { useCloseExpiredTask } from "@/hooks/subgraph/task";
import {
  useGetDisbursements,
  useGetTokenTransfers,
} from "@/hooks/subgraph/token";
import { PATHS } from "@/routes/paths";
import { toast } from "@workspace/ui/hooks/use-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { useState } from "react";
import DepartmentDetailsCard from "./details.card";
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
  const {
    data: entity,
    isLoading: entityLoading,
    isError,
    error,
  } = useGetEntityById(cuid.id);
  const { totalAllocatedTokens, statusLoading: allocatedLoading } =
    useCheckTotalAllocatedTokens(entity?.rewardManagement);
  const { unallocatedTokens, statusLoading: unallocatedLoading } =
    useCheckTotalUnallocatedTokens(entity?.rewardManagement);
  const { getEntityOwners, statusLoading: ownersLoading } = useGetEntityOwners(
    entity?.entityId,
  );
  const { data: disbursementData } = useGetDisbursements(
    entity?.rewardManagement,
  );
  const { data: tokenTransferData } = useGetTokenTransfers(
    entity?.rewardManagement
  );

  const { taskCloseExpired, taskPending: closePending } = useCloseExpiredTask();

  const transferList = tokenTransferData?.rewardManagementCreateds?.[0];
  const disbursementList = disbursementData?.rewardManagementCreateds?.[0];

  const Loading =
    entityLoading || allocatedLoading || unallocatedLoading || ownersLoading;
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [activeTab, setActiveTab] = useState<"direct" | "task">("direct");

  const handleCloseExpiredTasks = async () => {
    try {
      await taskCloseExpired({
        entityAddress: entity.rewardManagement as `0x${string}`,
      });
      toast({
        title: "Expired tasks closed successfully!",
        variant: "success",
      });
    } catch (err) {
      
      toast({
        title: "Failed to close expired tasks.",
        variant: "destructive",
      });
    }
  };

  if (Loading) {
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

  if (isError) {
    return (
      <p className="text-red-600">Error loading entity: {error.message}</p>
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
      {/* Pass entity data to child */}
      <DepartmentDetailsCard
        entity={entity}
        totalAllocatedTokens={totalAllocatedTokens}
        unallocatedTokens={unallocatedTokens}
        getEntityOwners={getEntityOwners}
        router={router}
        handleCloseExpiredTasks={handleCloseExpiredTasks}
        closePending={closePending}
      />
      
      <DepartmentDetailsTable
        cuid={entity.rewardManagement}
        setPagination={setPagination}
        pagination={pagination}
        filterTab={activeTab}
        setFilterTab={setActiveTab}
        transferList={transferList?.tokenTransfers ?? []}
        disbursementList={disbursementList?.disbursements ?? []}
      />
    </main>
  );
}
