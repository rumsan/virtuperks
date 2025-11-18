import { DataTablePagination } from "@/components/common/list/list.pagination";
import { ListTable } from "@/components/common/list/list.table";
import { useGetWhiteListedParticipantByTask } from "@/hooks/subgraph/participant";
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

  // const getTaskDetail = useGetTaskDetailById(taskId.id);
  // const taskData = getTaskDetail?.data?.data?.taskCreateds?.[0];

  const getWhiteListedParticipants = useGetWhiteListedParticipantByTask(
    taskId.id,
  );

  const whiteListedParticipants =
    getWhiteListedParticipants?.data?.data?.participantWhitelisteds || [];

  const hasWhitelistedParticipants = whiteListedParticipants.length > 0;

  const columns = useColumns();

  const data = useMemo(
    () => whiteListedParticipants,
    [whiteListedParticipants],
  );

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
        {hasWhitelistedParticipants ? (
          <>
            <CardTitle className="flex flex-col gap-2 w-full">
              <span className="text-2xl font-bold">
                Whitelisted Participants
              </span>
              <span className="text-lg text-gray-500 font-normal">
                List of all participants who have been whitelisted for this task
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
          </>
        ) : (
          <>
            <CardTitle className="flex flex-col gap-2 w-full">
              <span className="text-2xl font-bold">Task Participation</span>
              <span className="text-lg text-gray-500 font-normal">
                This task is open to all registered participants
              </span>
            </CardTitle>
            <div className="mt-6 flex flex-col items-center justify-center py-8 px-4">
              <div className="text-center w-full max-w-lg">
                <div className="mb-4 text-5xl">🌐</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No Whitelist Required
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed break-words">
                  This task does not have a whitelist. Any user with the{" "}
                  <span className="font-semibold text-blue-600">
                    participant role
                  </span>{" "}
                  can apply and participate.
                </p>
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-800">
                    ✓ Open participation enabled
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  );
};

export default TaskPortalParticipant;
