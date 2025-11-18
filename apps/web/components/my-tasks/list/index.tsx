"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";
import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import {
  useGetParticipantStatistic,
  useGetParticipantTaskBasedOnStatus,
} from "@/hooks/subgraph/participant";
import { useWallet } from "@/providers/walletProvider";
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
import { TaskCreated } from "@workspace/sdk/type";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { AlertCircle, CheckCircle, User, Users } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { useColumns } from "../details/details.column";
import ListCardDetails from "./list.card";

interface TaskListMainProps {
  router: AppRouterInstance;
}

export default function TaskListMain({ router }: TaskListMainProps) {
  const [tab, setTab] = useState<"applied" | "accepted" | "completed" | "verified">(
    "applied"
  );

  const ROW_HEIGHT = 50;
  const MIN_ROWS = 10;
  const TABLE_MIN_HEIGHT = ROW_HEIGHT * MIN_ROWS;

  // Shared table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { address } = useWallet();
  const { applied, completed, verified } = useGetParticipantStatistic(
    address as `0x${string}`
  );

  const {
    applied: taskApplied = [],
    completed: taskCompleted = [],
    verified: taskVerified = [],
    accepted: taskAccepted = [],
  } = useGetParticipantTaskBasedOnStatus(address as `0x${string}`);

  console.log("Completed: ", taskCompleted)
  const columns = useColumns();

  
  const createTable = (data: TaskCreated[]) =>
    useReactTable<TaskCreated>({
      data,
      columns,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        pagination,
      },
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      pageCount: Math.ceil((data?.length || 0) / pagination.pageSize),
    });

  const tableApplied = createTable(taskApplied);
  const tableAccepted = createTable(taskAccepted);
  const tableCompleted = createTable(taskCompleted);
  const tableVerified = createTable(taskVerified);

  

  const isLoading = false;

  if (isLoading) {
    return (
      <LoaderSkeleton
        title
        titleWidth="w-56"
        subtitle
        subtitleWidth="w-72"
        cardCount={3}
        gridCols="grid-cols-3"
        cardHeight="h-24"
        showTabs
        tabsCount={4}
        rowCount={5}
        rowHeight="h-20"
        showPagination
      />
    );
  }

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full overflow-x-hidden">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center mt-5">
          <div className="flex flex-col w-[80%] gap-1">
            <h1 className="font-bold text-3xl">My Tasks</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              Filter and view tasks by their status
            </h3>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 mt-1 gap-4 w-full">
          <Card className="font-normal text-base h-25 flex flex-col">
            <CardHeader className="flex-grow">
              <CardTitle className="flex items-center gap-2 p-0 mb-2 text-[#0F172A]">
                <User className="text-blue-500" size={20} />
                Verified Tasks
              </CardTitle>
              <CardFooter className="text-blue-500 text-2xl font-bold">
                {verified}
              </CardFooter>
            </CardHeader>
          </Card>

          <Card className="font-normal text-base h-25 flex flex-col">
            <CardHeader className="flex-grow">
              <CardTitle className="flex items-center gap-2 p-0 mb-2 text-[#0F172A]">
                <Users className="text-purple-500" size={20} />
                Applied
              </CardTitle>
              <CardFooter className="text-blue-500 text-2xl font-bold">
                {applied}
              </CardFooter>
            </CardHeader>
          </Card>

          <Card className="font-normal text-base h-25 flex flex-col">
            <CardHeader className="flex-grow">
              <CardTitle className="flex items-center gap-2 p-0 mb-2 text-[#0F172A]">
                <CheckCircle className="text-green-600" size={20} />
                Completed
              </CardTitle>
              <CardFooter className="text-blue-500 text-2xl font-bold">
                {completed}
              </CardFooter>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v as "applied" | "accepted" | "completed" | "verified");
            setPagination((p) => ({ ...p, pageIndex: 0 }));
          }}
        >
          <div className="flex items-center mt-10 mb-10">
            <div className="w-[800px]">
              <TabsList className="flex bg-blue-50 h-10">
                <TabsTrigger value="applied" className="w-full h-8">
                  Applied
                </TabsTrigger>
                <TabsTrigger value="accepted" className="w-full h-8">
                  Accepted
                </TabsTrigger>
                <TabsTrigger value="completed" className="w-full h-8">
                  Completed
                </TabsTrigger>
                <TabsTrigger value="verified" className="w-full h-8">
                  Verified
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          
          <TabsContent value="applied">
            <TaskTable
              table={tableApplied}
              data={taskApplied}
              label="applied"
              router={router}
              TABLE_MIN_HEIGHT={TABLE_MIN_HEIGHT}
              pagination={pagination}
              setPagination={setPagination}
            />
          </TabsContent>

          <TabsContent value="accepted">
            <TaskTable
              table={tableAccepted}
              data={taskAccepted}
              label="accepted"
              router={router}
              TABLE_MIN_HEIGHT={TABLE_MIN_HEIGHT}
              pagination={pagination}
              setPagination={setPagination}
            />
          </TabsContent>

          <TabsContent value="completed">
            <TaskTable
              table={tableCompleted}
              data={taskCompleted}
              label="completed"
              router={router}
              TABLE_MIN_HEIGHT={TABLE_MIN_HEIGHT}
              pagination={pagination}
              setPagination={setPagination}
            />
          </TabsContent>

          <TabsContent value="verified">
            <TaskTable
              table={tableVerified}
              data={taskVerified}
              label="verified"
              router={router}
              TABLE_MIN_HEIGHT={TABLE_MIN_HEIGHT}
              pagination={pagination}
              setPagination={setPagination}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}


function TaskTable({
  table,
  data,
  label,
  router,
  TABLE_MIN_HEIGHT,
  pagination,
  setPagination,
}: any) {
  console.log(label, {
    dataLength: data.length,
    rowCount: table.getRowModel().rows.length,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });
  
  if (!data || data.length === 0) {
    return (
      <div className="text-gray-500 text-center py-6 flex flex-col items-center gap-2">
        <AlertCircle className="text-gray-400" size={32} />
        <p>No {label} tasks found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-y-auto" style={{ minHeight: TABLE_MIN_HEIGHT }}>
        <ListCardDetails
          taskList={table.getRowModel().rows.map((r: any) => r.original)}
          router={router}
          tabStatus={label}
        />
      </div>
      <div className="mt-5 mb-5">
        <DataTablePagination
          table={table}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </>
  );
}
