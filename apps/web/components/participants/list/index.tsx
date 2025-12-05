

import { DataTablePagination } from "@/components/common/list/list.pagination";
import { ListTable } from "@/components/common/list/list.table";
import { useParticipantLookup } from "@/hooks/client/participant.lookup";
import { PATHS } from "@/routes/paths";
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
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Plus } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React from "react";
import { useColumns } from "./list.columns";

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

  const columns = useColumns();

  const role = process.env.NEXT_PUBLIC_PARTICIPANT_ROLE || "";

  const {
    data: participantData,
    isLoading: participantDataLoading,
    error: participantDataError,
  } = useParticipantLookup();
  


  const participantDataDestructure = participantData?.data ?? [];

  
  const table = useReactTable({
    data: participantDataDestructure,
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
      pagination,
    },
    onPaginationChange: setPagination,
  });
  

  const handleRowClick = (row: any) => {
    if (row.original.cuid) {
      router.push(PATHS.PARTICIPANT.DETAILS(row.original.cuid));
    }
  };

  return (
    <main className="gap-2 p-4 sm:px-8 sm:py-10 md:gap-8 w-full">
  <div className="flex space-y-4">
    <div className="flex flex-col gap-1 my-3">
      <h1 className="font-bold text-4xl">Participants</h1>
      <h3 className="text-gray-500 font-normal text-sm">
        List of all the participants
      </h3>
    </div>

    <div className="flex justify-end ml-auto mt-0">
      <Button onClick={() => router.push(PATHS.PARTICIPANT.ADD)}>
        <Plus size={20} strokeWidth={2.5} /> <span>Add Participant</span>
      </Button>
    </div>
  </div>

  {/* Centered wrapper */}
  <div className="w-full flex justify-center mt-6">
    <div className="w-full md:w-4.5/5"> 
    <Card className="p-4">
  <div className="p-2">
    <ListTable table={table} columns={columns} />
  </div>

  <DataTablePagination
    table={table}
    setPagination={setPagination}
    pagination={pagination}
  />
</Card>

    </div>
  </div>
</main>

  );
};

export default ParticipantList;
