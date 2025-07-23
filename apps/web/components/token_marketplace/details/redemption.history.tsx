"use client";

import { useGetRedeemedReward } from "@/hooks/subgraph/token-marketplace";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useColumns } from "./redemption.column";

const RedemptionHistory = () => {
  const { data, isLoading, error } = useGetRedeemedReward();
  const columns = useColumns();

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

  if (isLoading) {
    return (
      <p className="text-gray-500 text-sm p-6">Loading redemption history...</p>
    );
  }

  if (error) {
    return (
      <p className="text-red-600 text-sm p-6">
        Failed to load redemption history.
      </p>
    );
  }

  return (
    <main className="flex flex-col gap-4 p-6 bg-white rounded-xl ">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold">Redemption History</h3>
        <p className="text-sm text-gray-500">
          Recent redemptions for this token
        </p>
      </div>

      <div className=" ">
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
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
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

      {/* <div className="mt-4">
        <DataTablePagination
          table={table}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div> */}
    </main>
  );
};

export default RedemptionHistory;
