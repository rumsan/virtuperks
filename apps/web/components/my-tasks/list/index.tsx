"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";
import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import { useGetParticipantStatistic, useGetTaskListByParticipant } from "@/hooks/subgraph/participant";
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
import { CheckCircle, User, Users } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { useState } from "react";
import { useColumns } from "../details/details.column";
import ListCardDetails from "./list.card";
import { DatePickerWithRange } from "./list.date";

interface TaskListMainProps {
  router: AppRouterInstance;
}

export default function TaskListMain({ router }: TaskListMainProps) {
  const [tabStatus, setTabStatus] = useState("active");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { address } = useWallet();
  const { applied, completed, verified } = useGetParticipantStatistic(address as `0x${string}`);

  const { data: myTaskList, isLoading } = useGetTaskListByParticipant(
    address as `0x${string}`,
  );
  const taskList = myTaskList?.data?.participantTaskStatuses;


  const columns = useColumns();

  const table = useReactTable({
    data: taskList || [],
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

  if (isLoading) {
    return (
      <LoaderSkeleton
        title // h1: "My List"
        titleWidth="w-56"
        subtitle // h3: "List of all the tasks..."
        subtitleWidth="w-72"
        cardCount={3} // 3 summary cards in grid
        gridCols="grid-cols-3"
        cardHeight="h-24"
        showTabs
        tabsCount={2} // Participating, Owned
        rowCount={5} // Simulated rows for ListCardDetails
        rowHeight="h-20"
        showPagination
      />
    );
  }

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full overflow-x-hidden">
      <div className="space-y-4">
        <div className="flex items-center mt-5">
          <div className="flex flex-col w-[80%] gap-1">
            <h1 className="font-bold text-3xl">My List</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              List of all the tasks you participated in
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-4 mt-1 gap-4 w-full">
          <Card className="font-normal text-base h-25 flex flex-col">
            <CardHeader className="flex-grow">
              <CardTitle className="flex items-center gap-2 p-0 mb-2 text-[#0F172A]">
                <User className="text-blue-500" size={20} />
                Owned
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

        <Tabs defaultValue="active" className="">
          <div className="flex items-center mt-10 mb-10">
            <div className="w-[400px]">
              <TabsList className="flex bg-blue-50 h-10">
                <TabsTrigger
                  value="open"
                  className="w-full h-8"
                  onClick={() => setTabStatus("open")}
                >
                  Participating
                </TabsTrigger>
                <TabsTrigger
                  value="closed"
                  className="w-full h-8"
                  onClick={() => setTabStatus("completed")}
                >
                  Owned
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="ml-auto">
              <DatePickerWithRange />
            </div>
          </div>

          <div className="w-full mt-5 mb-5">
            <TabsContent className="w-full" value="active">
              <ListCardDetails
                taskList={taskList}
                router={router}
                tabStatus={tabStatus}
              />
            </TabsContent>
            <TabsContent className="w-full" value="completed">
              <ListCardDetails
                taskList={taskList}
                router={router}
                tabStatus={tabStatus}
              />
            </TabsContent>
          </div>
          <div className="mt-5 mb-5">
            <DataTablePagination
              table={table}
              setPagination={setPagination}
              pagination={pagination}
            />
          </div>
        </Tabs>
      </div>
    </main>
  );
}
