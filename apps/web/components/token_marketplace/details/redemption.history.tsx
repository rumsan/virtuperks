"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";
import LoaderSkeleton from "@/components/common/list/loder.skeleton";
import { useGetRedeemedReward } from "@/hooks/subgraph/token-marketplace";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";

const RedemptionHistory = () => {
  const {
    data: redeemedRewardsData,
    isLoading: redeemedLoading,
    error: redeemedError,
  } = useGetRedeemedReward();

  const redemptions = redeemedRewardsData?.data?.rewardRedeemeds || [];

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

  const columns = [
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.original.status === 1 ? "completed" : "pending";
        return (
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              status === "completed"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "from",
      header: "Wallet",
      cell: ({ row }: any) => (
        <p className="font-semibold text-gray-800">
          {row.original.from
            ? `${row.original.from.slice(0, 20)} . . . ${row.original.from.slice(-4)}`
            : "Unknown"}
        </p>
      ),
    },
    {
      accessorKey: "blockTimestamp",
      header: "Date",
      cell: ({ row }: any) =>
        new Date(
          Number(row.original.blockTimestamp) * 1000,
        ).toLocaleDateString(),
    },
    {
      accessorKey: "transactionHash",
      header: "Transaction ID",
      cell: ({ row }: any) =>
        row.original.transactionHash
          ? `${row.original.transactionHash.slice(0, 15)} . . . ${row.original.transactionHash.slice(-4)}`
          : "N/A",
    },
  ];

  const table = useReactTable({
    data: redemptions,
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

  if (redeemedLoading) {
    return (
      <LoaderSkeleton
        titleWidth="w-40"
        subtitleWidth="w-64"
        cardCount={7}
        gridCols="flex-col"
        cardHeight="h-20"
        showPagination
      />
    );
  }

  if (redeemedError) {
    return (
      <p className="text-red-600 text-sm">Failed to load redemption history.</p>
    );
  }

  return (
    <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full flex flex-col">
      <div className="space-y-4 flex-grow">
        <div className="flex flex-col gap-1 my-3">
          <h1 className="font-bold text-2xl">Redemption History</h1>
          <h3 className="text-gray-500 font-normal text-sm">
            Recent redemptions for this token
          </h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-4 text-gray-500 text-sm"
                  >
                    No redemption history found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-2 text-sm text-gray-700"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-5 mb-5">
          <DataTablePagination
            table={table}
            setPagination={setPagination}
            pagination={pagination}
          />
        </div>
      </div>
    </main>
  );
};

export default RedemptionHistory;
