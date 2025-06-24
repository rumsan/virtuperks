"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";
import { useGetAllTask } from "@/hooks/subgraph/task";
import { PATHS } from "@/routes/paths";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Plus } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { useState } from "react";
import { useColumns } from "../details/details.column";
import ListCardDetails from "./list.card";
import { DatePickerWithRange } from "./list.date";

interface TaskListMainProps {
  router: AppRouterInstance;
}

export default function TaskListMain({ router }: TaskListMainProps) {
  const [tabStatus, setTabStatus] = useState("active");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const getAllTask = useGetAllTask();

  const columns = useColumns();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const taskList = getAllTask?.data?.data?.taskCreateds;

  const table = useReactTable({
    data: taskList || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  if (getAllTask.isLoading) {
    // Skeleton loader for the whole page while loading tasks
    return (
      <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full flex flex-col">
        <div className="space-y-4">
          {/* Header skeleton */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col w-[80%] gap-2">
              <Skeleton className="h-6 w-48 rounded" /> {/* Title */}
              <Skeleton className="h-4 w-64 rounded" /> {/* Subtitle */}
            </div>
            <Skeleton className="h-10 w-36 rounded" /> {/* Button */}
          </div>

          {/* Tabs Skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-20 rounded" />
            <Skeleton className="h-10 w-20 rounded" />
            <div className="ml-auto">
              <Skeleton className="h-8 w-40 rounded" /> {/* DatePicker */}
            </div>
          </div>

          {/* ListCardDetails Skeleton: simulate 5 cards */}
          <div className="grid grid-cols-1 gap-4 mt-5 mb-5">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="mt-5 mb-5 w-full">
            <Skeleton className="h-10 w-full rounded" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full">
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="flex flex-col w-[80%] gap-1">
            <h1 className="font-bold text-xl">Task List</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              List of all the tasks
            </h3>
          </div>

          <div className="flex flex-col ml-auto justify-end h-full">
            <Button
              className="min-w-[10rem] fw-[600] h-10"
              variant="default"
              type="submit"
              onClick={() => router.push(PATHS.TASKS.ADD)}
            >
              <Plus size={22} strokeWidth={2.75} />
              <span>Create Task</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="active" className="">
          <div className="flex items-center">
            <div className="w-[400px]">
              <TabsList className="flex bg-blue-50 h-10">
                <TabsTrigger
                  value="open"
                  className="w-full h-8"
                  onClick={() => setTabStatus("open")}
                >
                  Open
                </TabsTrigger>
                <TabsTrigger
                  value="closed"
                  className="w-full h-8"
                  onClick={() => setTabStatus("completed")}
                >
                  Completed
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="ml-auto">
              <DatePickerWithRange />
            </div>
          </div>

          <div className="w-full mt-5 mb-5">
            <TabsContent className="w-full" value="active">
              <ListCardDetails
                taskList={taskList}
                router={router}
                tabStatus={tabStatus}
              />
            </TabsContent>
            <TabsContent className="w-full" value="completed">
              <ListCardDetails
                taskList={taskList}
                router={router}
                tabStatus={tabStatus}
              />
            </TabsContent>
          </div>
          <div className="mt-5 mb-5">
            <DataTablePagination
              table={table}
              setPagination={setPagination}
              pagination={pagination}
            />
          </div>
        </Tabs>
      </div>
    </main>
  );
}
