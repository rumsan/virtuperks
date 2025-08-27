// import { useGetTaskParticipantsWithStatus } from "@/hooks/subgraph/querycall";
import { DataTablePagination } from "@/components/common/list/list.pagination";
import { ListTable } from "@/components/common/list/list.table";
import { shortAddress } from "@/utils/shortAddress";
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
import { User } from "lucide-react";
import React, { useMemo } from "react";
import { useColumns } from "./details.column";

type Cuid = {
  id: string;
};

type TaskParticipantProps = {
  taskData: any;
  pendingParticipants: any[];
  acceptedParticipants: any[];
  completedParticipants: any[];
  verifiedPartcipants: any[];
};

const TaskParticipant = ({
  taskData,
  pendingParticipants,
  acceptedParticipants,
  completedParticipants,
  verifiedPartcipants,
}: TaskParticipantProps) => {
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

  const pendingAndAcceptedParticipants = useMemo(() => {
    return [
      ...(pendingParticipants || []),
      ...(completedParticipants || []),
      ...(verifiedPartcipants || []),
    ];
  }, [pendingParticipants, completedParticipants, verifiedPartcipants]);

  const table = useReactTable({
    data: pendingAndAcceptedParticipants,
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
          {acceptedParticipants.map((participant: any) => (
            <div
              key={participant.participant}
              className="flex flex-col items-center gap-1"
              title={participant.participant}
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#F1F5F9] cursor-pointer">
                <User color="#64748B" size={20} />
              </div>
              <span className="text-xs text-gray-500">
                {shortAddress(participant.participant)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default TaskParticipant;
