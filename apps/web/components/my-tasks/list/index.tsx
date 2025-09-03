"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";
import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import {
  useGetParticipantStatistic,
  useGetTaskListByParticipant,
} from "@/hooks/subgraph/participant";
import { useGetTasksOwnedByIndividual } from "@/hooks/subgraph/task";
import { useWallet } from "@/providers/walletProvider";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { TaskCreated } from "@workspace/sdk/type";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { AlertCircle, CheckCircle, User, Users } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { useState } from "react";
import { useColumns } from "../details/details.column";
import ListCardDetails from "./list.card";

interface TaskListMainProps {
  router: AppRouterInstance;
}

export default function TaskListMain({ router }: TaskListMainProps) {
  const [tab, setTab] = useState<"owned" | "participating">("owned");
  const ROW_HEIGHT = 50;
  const MIN_ROWS = 10;
  const TABLE_MIN_HEIGHT = ROW_HEIGHT * MIN_ROWS;
  // shared states
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState({});

  // separate pagination states
  const [paginationOwned, setPaginationOwned] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [paginationParticipating, setPaginationParticipating] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { address } = useWallet();
  const { applied, completed, verified } = useGetParticipantStatistic(
    address as `0x${string}`,
  );

  const { data: dataOwned, isLoading: isLoadingOwned } =
    useGetTasksOwnedByIndividual(address as `0x${string}`);
  const ownedTaskList = dataOwned?.data?.taskCreateds ?? [];

  const { data: dataParticipating } = useGetTaskListByParticipant(
    address as `0x${string}`,
    !address,
  );
  const participatingTask =
    dataParticipating?.data?.participantTaskStatuses ?? [];

  const columns = useColumns();

  // table for owned tasks
  const tableOwned = useReactTable<TaskCreated>({
    data: ownedTaskList,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: paginationOwned,
    },
    onPaginationChange: setPaginationOwned,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount: Math.ceil(ownedTaskList.length / paginationOwned.pageSize),
  });

  // table for participating tasks
  const tableParticipating = useReactTable<TaskCreated>({
    data: participatingTask,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: paginationParticipating,
    },
    onPaginationChange: setPaginationParticipating,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount: Math.ceil(
      participatingTask.length / paginationParticipating.pageSize,
    ),
  });

  if (isLoadingOwned) {
    return (
      <LoaderSkeleton
        title
        titleWidth="w-56"
        subtitle
        subtitleWidth="w-72"
        cardCount={3}
        gridCols="grid-cols-3"
        cardHeight="h-24"
        showTabs
        tabsCount={2}
        rowCount={5}
        rowHeight="h-20"
        showPagination
      />
    );
  }

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full overflow-x-hidden">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center mt-5">
          <div className="flex flex-col w-[80%] gap-1">
            <h1 className="font-bold text-3xl">My List</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              List of all the tasks you participated in
            </h3>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 mt-1 gap-4 w-full">
          <Card className="font-normal text-base h-25 flex flex-col">
            <CardHeader className="flex-grow">
              <CardTitle className="flex items-center gap-2 p-0 mb-2 text-[#0F172A]">
                <User className="text-blue-500" size={20} />
                Verified Tasks
              </CardTitle>
              <CardFooter className="text-blue-500 text-2xl font-bold">
                {verified}
              </CardFooter>
            </CardHeader>
          </Card>

          <Card className="font-normal text-base h-25 flex flex-col">
            <CardHeader className="flex-grow">
              <CardTitle className="flex items-center gap-2 p-0 mb-2 text-[#0F172A]">
                <Users className="text-purple-500" size={20} />
                Participating
              </CardTitle>
              <CardFooter className="text-blue-500 text-2xl font-bold">
                {applied}
              </CardFooter>
            </CardHeader>
          </Card>

          <Card className="font-normal text-base h-25 flex flex-col">
            <CardHeader className="flex-grow">
              <CardTitle className="flex items-center gap-2 p-0 mb-2 text-[#0F172A]">
                <CheckCircle className="text-green-600" size={20} />
                Total Task Completed
              </CardTitle>
              <CardFooter className="text-blue-500 text-2xl font-bold">
                {completed}
              </CardFooter>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v as "owned" | "participating");
            if (v === "owned")
              setPaginationOwned((p) => ({ ...p, pageIndex: 0 }));
            if (v === "participating")
              setPaginationParticipating((p) => ({ ...p, pageIndex: 0 }));
          }}
        >
          <div className="flex items-center mt-10 mb-10">
            <div className="w-[400px]">
              <TabsList className="flex bg-blue-50 h-10">
                <TabsTrigger value="owned" className="w-full h-8">
                  Owned
                </TabsTrigger>
                <TabsTrigger value="participating" className="w-full h-8">
                  Participating
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Owned Tab */}
          <TabsContent className="w-full" value="owned">
            {tableOwned.getRowModel().rows.length === 0 ? (
              <div className="text-gray-500 text-center py-6 flex flex-col items-center gap-2">
                <AlertCircle className="text-gray-400" size={32} />
                <p>No owned tasks found.</p>
                <p className="text-sm text-gray-400 max-w-md">
                  You currently don’t have any tasks that you own. Tasks appear
                  here once they are assigned or created by you.
                </p>
              </div>
            ) : (
              <>
                <div
                  className="overflow-y-auto"
                  style={{ minHeight: TABLE_MIN_HEIGHT }}
                >
                  <ListCardDetails
                    taskList={tableOwned
                      .getRowModel()
                      .rows.map((r) => r.original)}
                    router={router}
                    tabStatus="owned"
                  />
                </div>
                <div className="mt-5 mb-5">
                  <DataTablePagination
                    table={tableOwned}
                    pagination={paginationOwned}
                    setPagination={setPaginationOwned}
                  />
                </div>
              </>
            )}
          </TabsContent>

          {/* Participating Tab */}
          <TabsContent className="w-full" value="participating">
            {tableParticipating.getRowModel().rows.length === 0 ? (
              <div className="text-gray-500 text-center py-6 flex flex-col items-center gap-2">
                <AlertCircle className="text-gray-400" size={32} />
                <p>No participating tasks found.</p>
                <p className="text-sm text-gray-400 max-w-md">
                  You are not currently participating in any tasks. Once you
                  join or are assigned to a task, it will appear here.
                </p>
              </div>
            ) : (
              <>
                <div
                  className="overflow-y-auto"
                  style={{ minHeight: TABLE_MIN_HEIGHT }}
                >
                  <ListCardDetails
                    taskList={tableParticipating
                      .getRowModel()
                      .rows.map((r) => r.original)}
                    router={router}
                    tabStatus="participating"
                  />
                </div>
                <div className="mt-5 mb-5">
                  <DataTablePagination
                    table={tableParticipating}
                    pagination={paginationParticipating}
                    setPagination={setPaginationParticipating}
                  />
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
