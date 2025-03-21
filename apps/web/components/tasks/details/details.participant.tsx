import { DataTablePagination } from "@/components/common/list/list.pagination";
import { ListTable } from "@/components/common/list/list.table";
import {
  useGetAcceptedList,
  useGetParticipantApplied,
  useGetTaskCompletedList,
} from "@/hooks/subgraph/querycall";
import { filterParticipants } from "@/utils/filterData";
import { shortAddress } from "@/utils/shortAddress"; // Create this utility if not exists
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
import { AcceptedTaskData } from "@workspace/types/task";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Search, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useColumns } from "./details.column";

type Cuid = {
  id: string;
};

type TaskParticipantProps = {
  taskId: Cuid;
};

const TaskParticipant = ({ taskId }: TaskParticipantProps) => {
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

  const { participantDatas } = useGetParticipantApplied(taskId);
console.log(participantDatas,'detail.participant')
  const { acceptedLoading, acceptedParticipant } = useGetAcceptedList(taskId);
  const { completedData } = useGetTaskCompletedList(taskId);


  
  const [participantList, setParticipantList] = useState<any[]>([]);


  useEffect(() => {
    const filteredParticipants = filterParticipants(
      participantDatas,
      acceptedParticipant,
      completedData
    );
 

    if (JSON.stringify(filteredParticipants) !== JSON.stringify(participantList)) {
      

      setParticipantList(filteredParticipants);
    }
  }, [participantDatas, acceptedParticipant, completedData, participantList]);

  const table = useReactTable({
    data: participantList,
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
      <Card className="w-[80%] h-full p-4">
        <CardTitle className="flex flex-col gap-2 w-full">
          <span>Requests</span>
          <span className="text-sm text-gray-500 font-normal">
            List of all the requests in this stack
          </span>
        </CardTitle>

        <div className="w-full h-10 flex rounded-md border border-gray-200 rounded-md items-center mt-3 mb-3 p-3">
          <p className="text-gray-500">
            <Search size={20} strokeWidth={2.75} />
          </p>
          <Input
            type="text"
            placeholder="Search"
            className="border-none focus:outline-none"
          />
        </div>

        <div className="">
          <ListTable table={table} columns={columns} />
          <hr />
          <DataTablePagination
            table={table}
            setPagination={setPagination}
            pagination={pagination}
          />
        </div>
      </Card>

      <Card className="w-[20%] ml-auto p-4">
        <CardTitle className="flex flex-col gap-2 w-full">
          <span>Participants</span>
          <span className="text-sm text-gray-500 font-normal">
            Accepted participants in this task
          </span>
        </CardTitle>

        <div className="flex items-center w-full mt-5 mb-5 gap-2 flex-wrap">
          {acceptedParticipant?.map((participant: AcceptedTaskData) => (
            <div
              key={participant?.participant}
              className="flex flex-col items-center gap-1"
              title={participant?.participant} // Add title attribute for hover
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#F1F5F9] cursor-pointer">
                <User color="#64748B" size={20} />
              </div>
              <span className="text-xs text-gray-500">
                {shortAddress(participant?.participant)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default TaskParticipant;
