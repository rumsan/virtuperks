"use client";

import { PATHS } from "@/routes/paths";
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
import { ArrowLeft } from "lucide-react";
import React from "react";
import TreasurerCard from "./details.card";
import { useColumns } from "./details.columns";
import TreasurerDetailsTable from "./details.table";

export type Cuid = {
  id: string;
};

type TreasurerDetailsProps = {
  cuid: Cuid;
  router: any;
};

export default function TreasurerDetails({
  cuid,
  router,
}: TreasurerDetailsProps) {
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
    <main className="gap-2 p-4 sm:px-8 md:gap-8">
      <div
        onClick={() => router.push(PATHS.TREASURER.HOME)}
        className="flex items-center gap-2 cursor-pointer hover:text-gray-400"
      >
        <ArrowLeft size={24} strokeWidth={2} />
        <span className="font-base text-gray-700">Back</span>
      </div>
      <div className="flex flex-col gap-1 my-2">
        <h1 className="font-bold text-4xl">Treasurer Details</h1>
        <h3 className="text-gray-500 font-normal text-sm">
          Detailed view of the selected department
        </h3>
      </div>

      <TreasurerCard />

      <TreasurerDetailsTable
        table={table}
        columns={columns}
        pagination={pagination}
        setPagination={setPagination}
      />
    </main>
  );
}
