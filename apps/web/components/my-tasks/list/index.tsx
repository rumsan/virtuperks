"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";
import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import {
  useGetParticipantStatistic,
  useGetTaskListByParticipant,
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
  const [tab, setTab] = useState<
    "participating" | "owned" | "tab3"
  >("participating");

  const ROW_HEIGHT = 50;
  const MIN_ROWS = 10;
  const TABLE_MIN_HEIGHT = ROW_HEIGHT * MIN_ROWS;

  // Shared table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    {}
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  // Pagination states for each tab
  const [paginationParticipating, setPaginationParticipating] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [paginationOwned, setPaginationOwned] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [paginationTab3, setPaginationTab3] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  

  const { address } = useWallet();
  const { applied, completed, verified } = useGetParticipantStatistic(
    address as `0x${string}`
  );

  const { data: dataParticipating } = useGetTaskListByParticipant(
    address as `0x${string}`,
    !address
  );
  const participatingTask =
    dataParticipating?.data?.participantTaskStatuses ?? [];

  const columns = useColumns();

  // Table instances
  const tableParticipating = useReactTable<TaskCreated>({
    data: participatingTask,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: paginationParticipating,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPaginationParticipating,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount: Math.ceil(participatingTask.length / paginationParticipating.pageSize),
  });

  // Dummy tables for now
  const tableOwned = useReactTable<TaskCreated>({
    data: [],
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: paginationOwned,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPaginationOwned,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount: 0,
  });

  const tableTab3 = useReactTable<TaskCreated>({
    data: [],
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: paginationTab3,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPaginationTab3,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount: 0,
  });

  
  const isLoading = false; // Replace with actual loading state if needed

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
            <h1 className="font-bold text-3xl">My List</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              List of all tasks
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
                Participating
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
                Total Task Completed
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
            setTab(v as "participating" | "owned" | "tab3" );
            // Reset pageIndex for corresponding tab
            if (v === "participating") setPaginationParticipating((p) => ({ ...p, pageIndex: 0 }));
            if (v === "owned") setPaginationOwned((p) => ({ ...p, pageIndex: 0 }));
            if (v === "tab3") setPaginationTab3((p) => ({ ...p, pageIndex: 0 }));
          }}
        >
          <div className="flex items-center mt-10 mb-10">
            <div className="w-[600px]">
              <TabsList className="flex bg-blue-50 h-10">
                <TabsTrigger value="participating" className="w-full h-8">
                  Participating
                </TabsTrigger>
                <TabsTrigger value="owned" className="w-full h-8">
                  Owned
                </TabsTrigger>
                <TabsTrigger value="tab3" className="w-full h-8">
                  Tab 3
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Participating Tab */}
          <TabsContent className="w-full" value="participating">
            {tableParticipating.getRowModel().rows.length === 0 ? (
              <div className="text-gray-500 text-center py-6 flex flex-col items-center gap-2">
                <AlertCircle className="text-gray-400" size={32} />
                <p>No participating tasks found.</p>
                <p className="text-sm text-gray-400 max-w-md">
                  You are not currently participating in any tasks.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-y-auto" style={{ minHeight: TABLE_MIN_HEIGHT }}>
                  <ListCardDetails
                    taskList={tableParticipating.getRowModel().rows.map((r) => r.original)}
                    router={router}
                    tabStatus="participating"
                  />
                </div>
                <div className="mt-5 mb-5">
                  <DataTablePagination
                    table={tableParticipating}
                    pagination={paginationParticipating}
                    setPagination={setPaginationParticipating}
                  />
                </div>
              </>
            )}
          </TabsContent>

          {/* Owned Tab */}
          <TabsContent className="w-full" value="owned">
            <div className="text-gray-500 text-center py-6 flex flex-col items-center gap-2">
              <AlertCircle className="text-gray-400" size={32} />
              <p>No owned tasks found.</p>
            </div>
          </TabsContent>

          {/* Tab 3 */}
          <TabsContent className="w-full" value="tab3">
            <div className="text-gray-500 text-center py-6 flex flex-col items-center gap-2">
              <AlertCircle className="text-gray-400" size={32} />
              <p>No tasks found.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
