"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";
import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import { useClosedTask, useOpenTask } from "@/hooks/subgraph/task";
import { PATHS } from "@/routes/paths";
import hasRole from "@/utils/role";
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
import { TaskCreated } from "@workspace/sdk/types/task.type";
import { Button } from "@workspace/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Plus } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { useColumns } from "../details/details.column";
import ListCardDetails from "./list.card";

interface TaskListMainProps {
  router: AppRouterInstance;
}

export default function TaskListMain({ router }: TaskListMainProps) {
  const [tabStatus, setTabStatus] = useState<"open" | "closed">("open");

  //Shared states for sorting/filtering
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  //Separate pagination states
  const [paginationOpen, setPaginationOpen] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [paginationClosed, setPaginationClosed] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const openTask = useOpenTask();
  const closeTask = useClosedTask();

  const hasAdminOwnerRole = hasRole({
    role: process.env.NEXT_PUBLIC_DEFAULT_ADMIN_ROLE || "",
  });

  const openTaskList: TaskCreated[] = openTask?.data?.data?.taskCreateds ?? [];
  const closedTaskList: TaskCreated[] =
    closeTask?.data?.data?.taskCreateds ?? [];

  const isLoading =
    (tabStatus === "open" && openTask.isLoading) ||
    (tabStatus === "closed" && closeTask.isLoading);

  const columns = useColumns();

  //Table instance for Open Tasks
  const tableOpen = useReactTable<TaskCreated>({
    data: openTaskList,
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
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: paginationOpen,
    },
    onPaginationChange: setPaginationOpen,
    pageCount: Math.ceil(openTaskList.length / paginationOpen.pageSize),
  });

  //Table instance for Closed Tasks
  const tableClosed = useReactTable<TaskCreated>({
    data: closedTaskList,
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
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: paginationClosed,
    },
    onPaginationChange: setPaginationClosed,
    pageCount: Math.ceil(closedTaskList.length / paginationClosed.pageSize),
  });

  if (isLoading) {
    return (
      <LoaderSkeleton
        title
        subtitle
        titleWidth="w-40"
        subtitleWidth="w-64"
        showTabs
        showDatePicker
        showCreateButton
        cardCount={6}
        gridCols="flex-col"
        cardHeight="h-24"
        showPagination
      />
    );
  }

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full">
      <div className="space-y-4 mt-8">
        {/* Header */}
        <div className="flex items-center">
          <div className="flex flex-col w-[80%] gap-3">
            <h1 className="font-bold text-4xl">Task List</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              List of all the tasks
            </h3>
          </div>

          <div className="flex flex-col ml-auto justify-end h-full space-y-2">
            {/* Warning message always visible */}
            <div className="flex items-center gap-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded-md shadow-sm max-w-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">
                Only entity owners can create tasks.
              </span>
            </div>

            {/* Create Task Button */}
            <Button
              className="min-w-[10rem] font-semibold h-10"
              variant="default"
              onClick={() => router.push(PATHS.TASKS.ADD)}
            >
              <Plus size={22} strokeWidth={2.75} />
              <span>Create Task</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={tabStatus}
          onValueChange={(v) => {
            setTabStatus(v as "open" | "closed");
            if (v === "open")
              setPaginationOpen((p) => ({ ...p, pageIndex: 0 }));
            if (v === "closed")
              setPaginationClosed((p) => ({ ...p, pageIndex: 0 }));
          }}
        >
          <div className="flex items-center">
            <div className="w-[400px]">
              <TabsList className="flex bg-blue-50 h-10">
                <TabsTrigger value="open" className="w-full h-8">
                  Open
                </TabsTrigger>
                <TabsTrigger value="closed" className="w-full h-8">
                  Closed
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="w-full mt-8 mb-5">
            {/* Open Tab */}
            <TabsContent className="w-full" value="open">
              <ListCardDetails
                taskList={tableOpen
                  .getRowModel()
                  .rows.map((row) => row.original)}
                router={router}
                tabStatus="open"
              />
              <div className="mt-5 mb-5">
                <DataTablePagination
                  table={tableOpen}
                  pagination={paginationOpen}
                  setPagination={setPaginationOpen}
                />
              </div>
            </TabsContent>

            {/* Closed Tab */}
            <TabsContent className="w-full" value="closed">
              <ListCardDetails
                taskList={tableClosed
                  .getRowModel()
                  .rows.map((row) => row.original)}
                router={router}
                tabStatus="closed"
              />
              <div className="mt-5 mb-5">
                <DataTablePagination
                  table={tableClosed}
                  pagination={paginationClosed}
                  setPagination={setPaginationClosed}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
