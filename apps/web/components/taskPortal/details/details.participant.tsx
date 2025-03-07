import { ListTable } from "@/components/common/list/list.table";
import { participantList, TaskHistory } from "@/sampleData";
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
import { Card, CardTitle } from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { User } from "lucide-react";
import { useState } from "react";
import { useHistoryColumns } from "./history.column";

const TaskPortalParticipant = () => {
  const [hoveredWallet, setHoveredWallet] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useHistoryColumns();
  const table = useReactTable({
    data: TaskHistory || [],
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
    <>
      <Card className="flex flex-col w-[80%] p-4">
        <CardTitle className="flex flex-col gap-2 w-full">
          <span>Task History</span>
          <span className="text-sm text-gray-500 font-normal">
            List of all the transactions in this task
          </span>
        </CardTitle>

        <Tabs defaultValue="allTask" className="mt-3">
          <div className="w-[350px]">
            <TabsList className="grid w-full grid-cols-2 items-center bg-[#F1F5F9] h-10 pl-1 pr-1">
              <TabsTrigger
                value="allTask"
                className="flex items-center justify-center m-auto w-full h-8 text-[#334155]"
              >
                All Task
              </TabsTrigger>
              <TabsTrigger
                value="myTask"
                className="flex items-center justify-center m-auto w-full h-8 text-[#334155]"
              >
                My Task
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="w-full">
            <TabsContent value="allTask">
              <ListTable table={table} columns={columns} />
            </TabsContent>

            <TabsContent value="myTask">
              <ListTable table={table} columns={columns} />
            </TabsContent>
          </div>
        </Tabs>
      </Card>

      <Card className="w-[20%] ml-auto p-4">
        <CardTitle className="flex flex-col gap-2 w-full">
          <span>Participants</span>
          <span className="text-sm text-gray-500 font-normal">
            List of all the participants in this task
          </span>
        </CardTitle>

        <div className="flex items-center w-full mt-5 mb-5 gap-2 flex-wrap">
          {participantList.map((participant) => (
            <div
              key={participant.walletAddress}
              className="relative flex items-center justify-center h-8 w-8 rounded-full bg-[#F1F5F9] gap-4 cursor-pointer hover:bg-gray-50"
              onMouseEnter={() => setHoveredWallet(participant.walletAddress)}
              onMouseLeave={() => setHoveredWallet(null)}
            >
              <User color="#64748B" size={20} />

              {hoveredWallet === participant.walletAddress && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#297AD6] text-[#F8FAFC] text-xs px-2 py-1 rounded-md shadow-md">
                  {participant.walletAddress}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default TaskPortalParticipant;
