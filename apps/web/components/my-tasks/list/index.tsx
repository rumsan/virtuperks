"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";
import { useGetTaskListByParticipant } from "@/hooks/subgraph/participant";
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
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React from "react";
import { injected, useAccount, useConnect,  } from "wagmi";
import { useColumns } from "../details/details.column";
import TaskPortalCard from "./list.card";
import { useWallet } from "@/providers/walletProvider";

interface TaskPortalMainProps {
  router: AppRouterInstance;
}

export default function TaskPortalMain({ router }: TaskPortalMainProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  // const { address } = useAccount()
  const { address, isConnected } = useWallet()
  const {connect}= useConnect()
 
const getMyTaskList = useGetTaskListByParticipant(
    address as `0x${string}`,
    !isConnected || !address // Skip query if not connected
  );
  
  //const getMyTaskList =  useGetTaskListByParticipant(address as `0x${string}`) 
    
  console.log(getMyTaskList?.data?.data?.participantTaskStatuses, 'myowndata')
  const myTaskList = getMyTaskList?.data?.data?.participantTaskStatuses || [];
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
    data: myTaskList,
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

  if (!isConnected || !address) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <h1 className="font-bold text-4xl mb-6 text-gray-800">My Tasks</h1>
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full border border-gray-200">
          <p className="mb-6 text-gray-600 text-lg">
            Please connect your MetaMask wallet to view your tasks.
          </p>
          <button
            onClick={() => connect({ connector: injected() })}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-colors duration-200"
          >
            Connect MetaMask
          </button>
        </div>
      </main>
    );
  }

  // If not connected or no address, show connect wallet prompt


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
