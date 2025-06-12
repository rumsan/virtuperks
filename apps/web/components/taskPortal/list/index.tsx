"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";

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
import { Skeleton } from "@workspace/ui/components/skeleton";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React from "react";
import { useColumns } from "../details/details.column";
import TaskPortalCard from "./list.card";
import { useGetAllTask } from "@/hooks/subgraph/task";



interface TaskPortalMainProps {
  router: AppRouterInstance;
}

export default function TaskPortalMain({ router }: TaskPortalMainProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const getAllTask = useGetAllTask()
 
  const allTask = getAllTask?.data?.data?.taskCreateds || [];
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useColumns();


  const table = useReactTable({
    data: allTask,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (getAllTask.isLoading) {
    return (
      <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full flex flex-col">
        <div className="space-y-4 flex-grow">
          <div className="flex flex-col gap-1 my-3">
            <Skeleton className="h-10 w-48" /> {/* Title skeleton */}
            <Skeleton className="h-4 w-64" /> {/* Subtitle skeleton */}
          </div>

          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" /> // Task card skeleton
            ))}
          </div>

          <div className="mt-5 mb-5">
            <Skeleton className="h-10 w-full" /> {/* Pagination skeleton */}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full flex flex-col">
      <div className="space-y-4 flex-grow">
        <div className="flex flex-col gap-1 my-3">
          <h1 className="font-bold text-4xl">Task Portal</h1>
          <h3 className="text-gray-500 font-normal text-sm">
            Overview of all the tasks
          </h3>
        </div>

        <TaskPortalCard data={allTask} router={router} />

        <div className="mt-5 mb-5">
          <DataTablePagination
            table={table}
            setPagination={setPagination}
            pagination={pagination}
          />
        </div>
      </div>
    </main>
  );
}
