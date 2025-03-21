"use client";

import { Treasurers } from "@/sampleData";
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
import TokenCard from "./list.card";
import { useColumns } from "./list.column";
import TokenTable from "./list.table";
import ListToolBar from "./list.toolbar";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type TokenMainProps = {
  router: AppRouterInstance;
};

export default function TokenMain({ router }: TokenMainProps) {
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
  const table = useReactTable({
    data: Treasurers || [],
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
    <main className="gap-2 p-4 sm:px-8 sm:py-10 md:gap-8 w-full">
      <div className="flex items-center space-y-4">
        <div className="flex flex-col gap-1 my-3">
          <h1 className="font-bold text-4xl">Token Management</h1>
          <h3 className="text-gray-500 font-normal text-sm">
            Overview of tokens
          </h3>
        </div>
        <div className="flex items-center ml-auto">
          <ListToolBar router={router} />
        </div>
      </div>

      <TokenCard />
      <TokenTable
        table={table}
        columns={columns}
        pagination={pagination}
        setPagination={setPagination}
      />
    </main>
  );
}
