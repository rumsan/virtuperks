"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";

import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import { useGetAllTask } from "@/hooks/subgraph/task";
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
import { Tasks } from "@workspace/sdk/type";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React from "react";
import { useColumns } from "../details/details.column";
import TaskPortalCard from "./list.card";

interface TaskPortalMainProps {
  router: AppRouterInstance;
}

export default function TaskPortalMain({ router }: TaskPortalMainProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const getAllTask = useGetAllTask();

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

  const columns = useColumns() as import("@tanstack/react-table").ColumnDef<
    Tasks,
    any
  >[];

  const table = useReactTable<Tasks>({
    data: allTask,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
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
      pagination,
    },
  });

  if (getAllTask.isLoading) {
    return (
      <LoaderSkeleton
        titleWidth="w-56"
        subtitleWidth="w-72"
        cardCount={7}
        gridCols="flex-col"
        cardHeight="h-20"
        showPagination
      />
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

        {/* <TaskPortalCard data={allTask} router={router} /> */}

        <TaskPortalCard
          data={table.getRowModel().rows.map((row) => row.original)}
          router={router}
        />

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
