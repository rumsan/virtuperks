import { DataTablePagination } from "@/components/common/list/list.pagination";
import { ListTable } from "@/components/common/list/list.table";
import { useGetWhiteListedParticipantByTask } from "@/hooks/subgraph/participant";
import { useGetTaskDetailById } from "@/hooks/subgraph/taskDetail";
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
import { useMemo, useState } from "react";
import { useColumns } from "./details.column";


type TaskPortalParticipantProps = { taskId: any };

const TaskPortalParticipant = ({ taskId }: TaskPortalParticipantProps) => {
  const [hoveredWallet, setHoveredWallet] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  const getTaskDetail = useGetTaskDetailById(taskId.id);
  const taskData = getTaskDetail?.data?.data?.taskCreateds?.[0];

  const getWhiteListedParticipants = useGetWhiteListedParticipantByTask(
    taskData?.internal_id
  );

  const whiteListedParticipants =
    getWhiteListedParticipants?.data?.data?.participantWhitelisteds || [];

  console.log("✅ Data: ", whiteListedParticipants);

  const columns = useColumns();

  const data = useMemo(() => whiteListedParticipants, [whiteListedParticipants]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <>
      {/* Left Section */}
      <Card className="flex flex-col w-[80%] p-4">
        <CardTitle className="flex flex-col gap-2 w-full">
        <span className="text-2xl font-bold">Task History</span>
<span className="text-lg text-gray-500 font-normal">
  List of all whitelisted participants for this task
</span>
        </CardTitle>
        <div className="mt-4">
          <ListTable table={table} columns={columns} />
          <hr className="my-3" />
          <DataTablePagination
            table={table}
            setPagination={setPagination}
            pagination={pagination}
          />
        </div>
      </Card>
    </>
  );
};

export default TaskPortalParticipant;
