import { DataTablePagination } from "@/components/common/list/list.pagination";
import { ListTable } from "@/components/common/list/list.table";
import { useGetWhiteListedParticipants } from "@/hooks/subgraph/participant";
import { useParticipantLookup } from "@/hooks/subgraph/participantLookup";
import { PATHS } from "@/routes/paths";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Plus } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React from "react";
import { useColumns } from "./list.columns";
import ListToolBar from "./list.toolbar";

type ParticipantListProps = {
  router: AppRouterInstance;
};

const ParticipantList = ({ router }: ParticipantListProps) => {
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

  const {
    data: participantsResponse,
    isLoading: isWhitelistLoading,
    isError: isWhitelistError,
  } = useGetWhiteListedParticipants();

  const {
    lookupByWallet,
    isLoading: isLookupLoading,
    isError: isLookupError,
  } = useParticipantLookup();

  const isLoading = isWhitelistLoading || isLookupLoading;
  const isError = isWhitelistError || isLookupError;

  const participantWallets =
    participantsResponse?.data?.participantWhitelisteds ?? [];
  const participantList = participantWallets.map((p: any) => ({
    wallet: p.participant,
  }));

  const columns = useColumns({ lookupByWallet, isLoading, isError });

  // Calculate total pages like in RedemptionHistory
  const totalPages = Math.max(
    1,
    Math.ceil(participantList.length / pagination.pageSize),
  );

  // Ensure pageIndex is always in range
  React.useEffect(() => {
    if (pagination.pageIndex >= totalPages) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: totalPages - 1,
      }));
    }
  }, [pagination.pageIndex, totalPages]);

  let paginatedData = participantList.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  );

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <main className="gap-2 p-4 sm:px-8 sm:py-10 md:gap-8 w-full">
      {isLoading && <div>Loading participants...</div>}
      {isError && <div>Error loading participants</div>}

      {!isLoading && !isError && (
        <>
          <div className="flex space-y-4">
            <div className="flex flex-col gap-1 my-3">
              <h1 className="font-bold text-4xl">Participants</h1>
              <h3 className="text-gray-500 font-normal text-sm">
                List of all the participants
              </h3>
            </div>
            <div className="flex justify-end ml-auto">
              <Button onClick={() => router.push(PATHS.PARTICIPANT.ADD)}>
                <Plus size={20} strokeWidth={2.5} />{" "}
                <span>Add Participant</span>
              </Button>
            </div>
          </div>

          <Card className="p-4">
            <ListToolBar />
            <ListTable table={table} columns={columns} />
            <DataTablePagination
              table={table}
              pagination={pagination}
              setPagination={setPagination}
            />
          </Card>
        </>
      )}
    </main>
  );
};

export default ParticipantList;
