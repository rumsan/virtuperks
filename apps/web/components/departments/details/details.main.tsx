"use client";

import { PATHS } from "@/routes/paths";
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
import { Departments } from "../list/list.card";
import DepartmentDetailsCard from "./details.card";
import { useColumns } from "./details.column";
import DepartmentDetailsTable from "./details.table";

export type Cuid = {
  id: string;
};

type DepartmentDetailsProps = {
  cuid: Cuid;
  router: any;
};

export default function DepartmentDetails({
  cuid,
  router,
}: DepartmentDetailsProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = useColumns();
  const table = useReactTable({
    data: Departments || [],
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
    <main className="gap-2 p-4 sm:px-8 md:gap-8 w-full">
      <div
        onClick={() => router.push(PATHS.DEPARTMENT.HOME)}
        className="flex items-center gap-2 cursor-pointer hover:text-gray-400"
      >
        <ArrowLeft size={24} strokeWidth={2} />
        <span className="font-base text-gray-700">Back</span>
      </div>
      <div className="flex flex-col gap-1 my-2">
        <h1 className="font-bold text-4xl">Rahat Consulting</h1>
        <h3 className="text-gray-500 font-normal text-sm">
          Detailed view of the selected department
        </h3>
      </div>

      <DepartmentDetailsCard cuid={cuid} />

      <DepartmentDetailsTable table={table} columns={columns} />
    </main>
  );
}
