"use client";

import { useGetRedeemedReward } from "@/hooks/subgraph/token-marketplace";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

interface Redemption {
  name: string;
  date: string;
  status: "completed" | "pending";
  txnId: string;
}

const RedemptionHistory = () => {
  const { data, isLoading, error } = useGetRedeemedReward();
  const columns: ColumnDef<any>[] = [
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const rawStatus = row.original.status;
        const status = rawStatus === 1 ? "completed" : "pending";
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              status === "completed"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: "Wallet",
      accessorKey: "from",
      cell: ({ row }) => {
        const wallet = row.original.from || "Wallet Address";
        return (
          <span className="font-medium text-gray-800">
            {wallet
              ? `${wallet.slice(0, 10)}...${wallet.slice(-4)}`
              : "Unknown"}
          </span>
        );
      },
    },
    {
      header: "Date",
      accessorKey: "blockTimestamp",
      cell: ({ row }) => {
        const date = new Date(Number(row.original.blockTimestamp) * 1000);
        return date.toLocaleDateString();
      },
    },
    {
      header: "Transaction ID",
      accessorKey: "transactionHash",
      cell: ({ row }) => {
        const txnId = row.original.transactionHash;
        return txnId ? `${txnId.slice(0, 12)}...${txnId.slice(-4)}` : "N/A";
      },
    },
  ];

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 7,
  });

  const table = useReactTable({
    data: data?.data?.rewardRedeemeds || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
  });

  return (
    <div className="border border-gray-200 shadow-md rounded-xl p-6 bg-white">
      <h3 className="text-xl font-bold mb-3">Redemption History</h3>
      <p className="text-sm text-gray-500 mb-4">
        Recent redemptions for this token
      </p>

      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading redemption history...</p>
      ) : error ? (
        <p className="text-red-600 text-sm">
          Failed to load redemption history.
        </p>
      ) : (
        <>
          <div className="border border-gray-100 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
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
              <tbody className="bg-white divide-y divide-gray-100">
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
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-3 text-sm text-gray-700"
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
          <div className="mt-4">
            {/* <DataTablePagination
              table={table}
              pagination={pagination}
              setPagination={setPagination}
            /> */}
          </div>
        </>
      )}
    </div>
  );
};

export default RedemptionHistory;
