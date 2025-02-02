"use client";

import { useColumns } from "@/components/departments/details/details.column";
import DepartmentDetailsTable from "@/components/departments/details/details.table";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Treasurers } from "../list/list.card";
import TreasurerCard from "./details.card";

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

      <Tabs defaultValue="departmentOverview" className="">
        <div className="w-[400px]">
          <TabsList className="flex bg-blue-50 h-10">
            <TabsTrigger value="departmentOverview" className="w-full h-8">
              Department Overview
            </TabsTrigger>
            <TabsTrigger value="allocationHistory" className="w-full h-8">
              Allocation History
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="w-full">
          <TabsContent className="w-full" value="departmentOverview">
            {/* <DepartmentDetailsCard cuid={cuid} /> */}
            <TreasurerCard />
          </TabsContent>
          <TabsContent className="w-full" value="allocationHistory">
            <DepartmentDetailsTable
              table={table}
              columns={columns}
              setPagination={setPagination}
              pagination={pagination}
            />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
