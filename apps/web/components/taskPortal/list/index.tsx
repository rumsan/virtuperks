"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";
import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import { useGetAllTask, useGetTaskByName, useGetTasksNoApproval } from "@/hooks/subgraph/task";
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
import { Activity, Droplet, Search } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React from "react";
import TaskPortalCard from "./list.card";
import { useColumns } from "./list.column";

interface TaskPortalMainProps {
  router: AppRouterInstance;
}

export default function TaskPortalMain({ router }: TaskPortalMainProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [taskInput, setTaskInput] = React.useState<string>("");
  const [debouncedTaskName, setDebouncedTaskName] = React.useState<string>("");
  const [activeTab, setActiveTab] = React.useState<string>("activities"); 


  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedTaskName(taskInput), 500);
    return () => clearTimeout(handler);
  }, [taskInput]);

  const getAllTask = useGetAllTask();
  const { data: tasksNoApproval, isLoading: tasksNoApprovalLoadoing } = useGetTasksNoApproval();
  const getTaskByName = useGetTaskByName(debouncedTaskName);



  const tasksToDisplay = React.useMemo(() => {
    if (activeTab === "blood") {

      if (tasksNoApprovalLoadoing) return [];
      return tasksNoApproval?.data?.taskCreateds || [];
    }


    if (debouncedTaskName && getTaskByName.data?.data?.taskCreateds) {
      return getTaskByName.data.data.taskCreateds;
    }

    return getAllTask?.data?.data?.taskCreateds || [];
  }, [
    activeTab,
    tasksNoApproval,
    tasksNoApprovalLoadoing,
    debouncedTaskName,
    getTaskByName.data,
    getAllTask.data,
  ]);


  const tasksSortedByStatusAndDate = React.useMemo(() => {
    return tasksToDisplay.sort((taskA: any, taskB: any) => {
      const isTaskAOpen = taskA.taskDetail.isOpen;
      const isTaskBOpen = taskB.taskDetail.isOpen;
      if (isTaskAOpen && !isTaskBOpen) return -1;
      if (!isTaskAOpen && isTaskBOpen) return 1;
      return Number(taskB.taskDetail.expiryDate) * 1000 - Number(taskA.taskDetail.expiryDate) * 1000;
    });
  }, [tasksToDisplay]);


  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  const columns = useColumns() as import("@tanstack/react-table").ColumnDef<Tasks, any>[];

  const table = useReactTable<Tasks>({
    data: tasksSortedByStatusAndDate,
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
    state: { sorting, columnFilters, columnVisibility, rowSelection, pagination },
  });

  if (getAllTask.isLoading || (debouncedTaskName && getTaskByName.isLoading)) {
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
    <main className="gap-4 p-4 sm:px-6 md:gap-4 w-full flex flex-col">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-4xl flex items-center gap-2">
          Task Portal
        </h1>
        <p className="text-gray-500 text-sm">Manage and explore all your tasks effortlessly.</p>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mt-8 mb-6">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tasks by name..."
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className="border pl-10 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            onClick={() => setActiveTab("activities")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${activeTab === "activities"
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            <Activity className="w-4 h-4" />
            Activities
          </button>

          <button
            onClick={() => setActiveTab("blood")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${activeTab === "blood"
              ? "bg-red-600 text-white border-red-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            <Droplet className="w-4 h-4" />
            Blood Donation
          </button>
        </div>
      </div>

      {/* Task Cards */}
      <TaskPortalCard
        data={table.getRowModel().rows.map((row) => row.original)}
        router={router}
      />

      {/* Pagination */}
      <div className="mt-5 mb-5">
        <DataTablePagination
          table={table}
          setPagination={setPagination}
          pagination={pagination}
        />
      </div>
    </main>
  );
}
