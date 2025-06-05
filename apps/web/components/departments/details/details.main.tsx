"use client";

import { useGetEntityById } from "@/hooks/subgraph/entity";
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
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React from "react";
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

  const { data, isLoading, isError, error } = useGetEntityById(cuid.id);

  const EntityData = data?.data?.entityTaskManagerCreateds?.[0];
  const taskData = EntityData?.tasks || [];

  const columns = useColumns();
  const table = useReactTable({
    data: taskData,
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
        onClick={() => router.push(PATHS.DEPARTMENT.HOME)}
        className="flex items-center gap-2 cursor-pointer hover:text-gray-400"
      >
        <ArrowLeft size={24} strokeWidth={2} />
        <span className="font-base text-gray-700">Back</span>
      </div>
      s{isLoading && <p className="text-gray-600">Loading entity details...</p>}
      {isError && (
        <p className="text-red-600">Error loading entity: {error.message}</p>
      )}
      {!isLoading && !isError && (
        <>
          <DepartmentDetailsCard cuid={cuid} router={router} />
          <DepartmentDetailsTable
            table={table}
            columns={columns}
            pagination={pagination}
            setPagination={setPagination}
          />
        </>
      )}
    </main>
  );
}
