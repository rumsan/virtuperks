"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";
import {
  useGetRedeemedReward,
  useUpdateRedemptionStatus,
} from "@/hooks/subgraph/token-marketplace";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useColumns } from "./redemption.column";
interface RedemptionHistoryProps {
  rewardId: string;
}

const RedemptionHistory = ({ rewardId }: RedemptionHistoryProps) => {
  const {
    data: redeemedReward,
    isLoading,
    error,
  } = useGetRedeemedReward(rewardId);

  // const getRedeemedRewardList =
  //   redeemedReward?.data?.rewardRedemptionCreateds[0].rewardRedeemedEvents ||
  //   [];
  const getRedeemReward = useGetRedeemedReward(rewardId);
console.log("getRedeemReward77777-----------", getRedeemReward?.data?.data);



  const {
    UpdateRedeemStatus: updateStatus,
    UpdateRedeemPending: isUpdating,
    UpdateRedeemSuccess: updateSuccess,
  } = useUpdateRedemptionStatus();

  const columns = useColumns(updateStatus, isUpdating);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: [],
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
    <main className="flex flex-col gap-4 p-6 bg-white rounded-xl">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold">Redemption History</h3>
        <p className="text-sm text-gray-500">
          Recent redemptions for this token
        </p>
      </div>

      {/* Table Container */}
      <div className="border rounded-lg min-h-[490px]">
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className={`
                  px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider
                  ${index === 0 ? "w-[200px]" : ""}
                  ${index === 1 ? "w-[180px]" : ""}
                  ${index === 2 ? "w-[160px]" : ""}
                  ${index === 3 ? "w-[100px]" : ""}
                `}
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
                  className="text-center py-12 text-gray-500 text-sm"
                >
                  No redemption history found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell, index) => (
                    <td
                      key={cell.id}
                      className={`
                    px-4 py-3 text-sm text-gray-700 truncate
                    ${index === 0 ? "w-[200px]" : ""}
                    ${index === 1 ? "w-[180px]" : ""}
                    ${index === 2 ? "w-[160px]" : ""}
                    ${index === 3 ? "w-[100px]" : ""}
                  `}
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

      {/* Pagination Section */}
      <div className="mt-4">
        <DataTablePagination
          table={table}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </main>
  );
};

export default RedemptionHistory;
