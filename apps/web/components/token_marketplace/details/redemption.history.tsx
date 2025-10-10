"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";
import {
  useRedemptionList,
  useUpdateRedemption,
} from "@/hooks/subgraph/token-marketplace";
import { useExecuteOfframpMutation } from "@/offramp/offramp.service";
import { RedemptionWithRelations } from "@/utils/types";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useColumns } from "./redemption.column";

interface RedemptionHistoryProps {
  rewardId: string;
}

const RedemptionHistory = ({ rewardId }: RedemptionHistoryProps) => {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();

  const { data: redemptionList } = useRedemptionList({ rewardId });
  const executeOfframpApi = useExecuteOfframpMutation();
  const updateRedemption = useUpdateRedemption();

  const allRedemptions = redemptionList?.data as
    | RedemptionWithRelations[]
    | undefined;

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const requestToOfframp = async (params: {
    transactionHash: string;
    senderAddress: string;
    redemptionId: string;
    tokenAmount: number;
    paymentDetails: Record<string, any>;
  }) => {
    setUpdatingId(params.redemptionId);

    try {
      const paymentProviderId =
        process.env.NEXT_PUBLIC_OFFFRAMP_PROVIDER_ID ?? "";

      const payload = { ...params, paymentProviderId };

      // Call offramp service
      const offrampResponse = await executeOfframpApi.mutateAsync(payload);

      const message = offrampResponse?.data?.transaction?.message;

      // Update redemption if offramp was successful
      if (
        offrampResponse?.success &&
        offrampResponse?.data?.transaction.status === "SUCCESS"
      ) {
        await updateRedemption.mutateAsync({
          cuid: params.redemptionId,
          data: { status: offrampResponse?.data?.transaction?.status },
        });

        // Show success message
        toast({
          title: "Redemption Updated Successfully!",
          description:
            message || "The redemption has been processed successfully.",
          variant: "default",
        });
      } else {
        // Show error/failure message if offramp was not successful
        const errorMessage =
          message || "Offramp processing failed. Please try again.";
        toast({
          title: "Redemption Processing Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error processing offramp request:", error);
      // Handle error - could show toast notification here
    } finally {
      // Clear loading state regardless of success or failure
      setUpdatingId(null);
    }
  };

  const columns = useColumns(requestToOfframp, updatingId);

  const [paginationAll, setPaginationAll] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  // const [paginationMine, setPaginationMine] = useState({
  //   pageIndex: 0,
  //   pageSize: 10,
  // });

  // const getRewardOwnerAddress = useGetRewardOwner(rewardId);

  const [tab, setTab] = useState<"all" | "mine">("all");

  const tableAll = useReactTable({
    data: allRedemptions ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination: paginationAll },
    onPaginationChange: setPaginationAll,
    pageCount: Math.ceil(
      (allRedemptions?.length ?? 0) / paginationAll.pageSize,
    ),
  });

  return (
    <main className="flex flex-col gap-4 p-6 bg-white rounded-xl">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold">Redemption History</h3>
        <p className="text-sm text-gray-500">
          Recent redemptions for this token
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as "all" | "mine");
          // Reset pagination for the newly selected tab
          if (v === "all") setPaginationAll((p) => ({ ...p, pageIndex: 0 }));
          // if (v === "mine") setPaginationMine((p) => ({ ...p, pageIndex: 0 }));
        }}
      >
        <TabsList className="mb-2">
          <TabsTrigger value="all">All History</TabsTrigger>
          <TabsTrigger value="mine">My History</TabsTrigger>
        </TabsList>

        {/* All History Tab */}
        <TabsContent value="all">
          <div
            className="border rounded-lg"
            style={{ minHeight: `${paginationAll.pageSize * 48 + 56}px` }}
          >
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {tableAll.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider h-[48px]"
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
                {tableAll.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-12 text-gray-500 text-sm"
                    >
                      No redemption history found.
                    </td>
                  </tr>
                ) : (
                  tableAll.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-3 text-sm text-gray-700 truncate min-h-[48px] h-[48px] align-middle"
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
            <DataTablePagination
              table={tableAll}
              pagination={paginationAll}
              setPagination={setPaginationAll}
            />
          </div>
        </TabsContent>

        {/* My History Tab */}
        {/* <TabsContent value="mine">
          <div
            className="border rounded-lg"
            style={{ minHeight: `${paginationMine.pageSize * 48 + 56}px` }}
          >
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {tableMine.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider h-[48px]"
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
                {tableMine.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-12 text-gray-500 text-sm"
                    >
                      No redemption history found.
                    </td>
                  </tr>
                ) : (
                  tableMine.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-3 text-sm text-gray-700 truncate min-h-[48px] h-[48px] align-middle"
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
            <DataTablePagination
              table={tableMine}
              pagination={paginationMine}
              setPagination={setPaginationMine}
            />
          </div>
        </TabsContent> */}
      </Tabs>
    </main>
  );
};

export default RedemptionHistory;
