"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";
import { useTaskList } from "@/hooks/subgraph/querycall";
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
import React from "react";
import { useColumns } from "../details/details.column";
import TaskPortalCard from "./list.card";

interface TaskPortalMainProps {
  router: any;
}

export default function TaskPortalMain({ router }: TaskPortalMainProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
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

  const getAllTask = useTaskList();

  const table = useReactTable({
    data: getAllTask?.data?.data?.taskCreateds || [],
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

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full flex flex-col">
      <div className="space-y-4 flex-grow">
        <div className="flex flex-col gap-1 my-3">
          <h1 className="font-bold text-4xl">Task Portal</h1>
          <h3 className="text-gray-500 font-normal text-sm">
            Overview of all the tasks
          </h3>
        </div>

        <TaskPortalCard table={table} router={router} />

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
