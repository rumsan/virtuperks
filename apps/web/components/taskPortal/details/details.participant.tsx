import { DataTablePagination } from "@/components/common/list/list.pagination";
import { ListTable } from "@/components/common/list/list.table";
import { useGetEntityRole } from "@/hooks/subgraph/entity";
import { useGetWhiteListedParticipantByTask } from "@/hooks/subgraph/participant";
import hasRole from "@/utils/role";
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
import { Card } from "@workspace/ui/components/card";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { useColumns } from "./details.column";

type TaskPortalParticipantProps = { taskId: any; isWhitelisted: boolean; taskData: any };

const TaskPortalParticipant = ({ taskId, isWhitelisted, taskData }: TaskPortalParticipantProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  const { address } = useAccount();

  const getWhiteListedParticipants = useGetWhiteListedParticipantByTask(taskId.id);
  const whiteListedParticipants =
    getWhiteListedParticipants?.data?.data?.participantWhitelisteds || [];
  const hasWhitelistedParticipants = whiteListedParticipants.length > 0;

  const { entityRole } = useGetEntityRole(
    taskData?.rewardManagement?.rewardManagement || "",
  );
  const hasEntityOwnerRole = hasRole({
    role: entityRole || "",
    address,
  });

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

  const isWhitelistFull =
    Number(taskData?.taskDetail?.acceptedParticipantCount ?? 0) >=
    Number(taskData?.taskDetail?.maxParticipants ?? 0);

  return (
    <Card className="flex flex-col w-[80%] p-6 space-y-6">

      {hasWhitelistedParticipants ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between gap-4">

            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold">Whitelisted Participants</h2>
              <p className="text-gray-500 text-sm">
                Participants approved to join this task
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="flex flex-col gap-4">
            <ListTable table={table} columns={columns} />

            <div className="pt-2">
              <DataTablePagination
                table={table}
                setPagination={setPagination}
                pagination={pagination}
              />
            </div>
          </div>
        </>
      ) : isWhitelisted ? (
        <div>
          <div className="flex flex-col items-center text-center py-10">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              No participants yet
            </h3>
            <p className="text-gray-600 text-sm max-w-sm">
              This task has whitelist enabled, but no participants have been added.
            </p>
          </div>
        </div>

      ) : (
        <div className="flex flex-col items-center text-center py-10">
          <div className="text-5xl mb-4">🌐</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No Whitelist Required
          </h3>

          <p className="text-gray-600 text-sm max-w-sm">
            Any user with the <span className="font-semibold text-blue-600">participant role</span> can join this task.
          </p>

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs">
            ✓ Open participation enabled
          </div>
        </div>
      )}
    </Card>
  );
};

export default TaskPortalParticipant;
