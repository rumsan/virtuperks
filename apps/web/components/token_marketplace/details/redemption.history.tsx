"use client";

import { DataTablePagination } from "@/components/common/list/list.pagination";
import {
  useGetRedeemedReward,
  useGetRedeemedRewardByParticiant,
  useUpdateRedemptionStatus,
} from "@/hooks/subgraph/token-marketplace";
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
import { useState } from "react";
import { useAccount } from "wagmi";
import { useColumns } from "./redemption.column";

interface RedemptionHistoryProps {
  rewardId: string;
}

// Dummy Data
const dummyAll = [
  {
    status: 1,
    from: "0xUSER_A",
    blockTimestamp: "1722430000",
    transactionHash: "0xHASH1",
    rewardRedemption: { rewardRedemption: "0xREWARD1" },
  },
  {
    status: 0,
    from: "0xUSER_B",
    blockTimestamp: "1722435000",
    transactionHash: "0xHASH2",
    rewardRedemption: { rewardRedemption: "0xREWARD2" },
  },
  {
    status: 1,
    from: "0xUSER_A",
    blockTimestamp: "1722430000",
    transactionHash: "0xHASH1",
    rewardRedemption: { rewardRedemption: "0xREWARD1" },
  },
  {
    status: 0,
    from: "0xUSER_B",
    blockTimestamp: "1722435000",
    transactionHash: "0xHASH2",
    rewardRedemption: { rewardRedemption: "0xREWARD2" },
  },
  {
    status: 1,
    from: "0xUSER_A",
    blockTimestamp: "1722430000",
    transactionHash: "0xHASH1",
    rewardRedemption: { rewardRedemption: "0xREWARD1" },
  },
  {
    status: 0,
    from: "0xUSER_B",
    blockTimestamp: "1722435000",
    transactionHash: "0xHASH2",
    rewardRedemption: { rewardRedemption: "0xREWARD2" },
  },
  {
    status: 1,
    from: "0xUSER_A",
    blockTimestamp: "1722430000",
    transactionHash: "0xHASH1",
    rewardRedemption: { rewardRedemption: "0xREWARD1" },
  },
  {
    status: 0,
    from: "0xUSER_B",
    blockTimestamp: "1722435000",
    transactionHash: "0xHASH2",
    rewardRedemption: { rewardRedemption: "0xREWARD2" },
  },
  {
    status: 1,
    from: "0xUSER_A",
    blockTimestamp: "1722430000",
    transactionHash: "0xHASH1",
    rewardRedemption: { rewardRedemption: "0xREWARD1" },
  },
  {
    status: 0,
    from: "0xUSER_B",
    blockTimestamp: "1722435000",
    transactionHash: "0xHASH2",
    rewardRedemption: { rewardRedemption: "0xREWARD2" },
  },
  {
    status: 1,
    from: "0xUSER_A",
    blockTimestamp: "1722430000",
    transactionHash: "0xHASH1",
    rewardRedemption: { rewardRedemption: "0xREWARD1" },
  },
  {
    status: 0,
    from: "0xUSER_B",
    blockTimestamp: "1722435000",
    transactionHash: "0xHASH2",
    rewardRedemption: { rewardRedemption: "0xREWARD2" },
  },
  {
    status: 1,
    from: "0xUSER_A",
    blockTimestamp: "1722430000",
    transactionHash: "0xHASH1",
    rewardRedemption: { rewardRedemption: "0xREWARD1" },
  },
  {
    status: 0,
    from: "0xUSER_B",
    blockTimestamp: "1722435000",
    transactionHash: "0xHASH2",
    rewardRedemption: { rewardRedemption: "0xREWARD2" },
  },
  {
    status: 1,
    from: "0xUSER_A",
    blockTimestamp: "1722430000",
    transactionHash: "0xHASH1",
    rewardRedemption: { rewardRedemption: "0xREWARD1" },
  },
  {
    status: 0,
    from: "0xUSER_B",
    blockTimestamp: "1722435000",
    transactionHash: "0xHASH2",
    rewardRedemption: { rewardRedemption: "0xREWARD2" },
  },
];

const dummyMine = [
  {
    status: 1,
    from: "0xMY_WALLET",
    blockTimestamp: "1722431000",
    transactionHash: "0xHASH_MY1",
    rewardRedemption: { rewardRedemption: "0xMY_REWARD" },
  },
];

const RedemptionHistory = ({ rewardId }: RedemptionHistoryProps) => {
  const { address, isConnected } = useAccount();
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

  // hookto get redeemed rewards by participant
  const getParticipantReward = useGetRedeemedRewardByParticiant(
    address as `0x${string}`,
  );
  const redeemedRewardsByParticipant =
    getParticipantReward?.data?.data?.redemptionStatuses || [];
  console.log(
    "redeemedRewardsByParticipantalhfahfahf",
    redeemedRewardsByParticipant,
  );

  const {
    UpdateRedeemStatus: updateStatus,
    UpdateRedeemPending: isUpdating,
    UpdateRedeemSuccess: updateSuccess,
  } = useUpdateRedemptionStatus();

  const columns = useColumns<(typeof dummyAll)[0]>(updateStatus, isUpdating);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [tab, setTab] = useState<"all" | "mine">("all");

  const getRedeemedRewardList = tab === "all" ? dummyAll : dummyMine;

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

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as "all" | "mine")}>
        <TabsList className="mb-2">
          <TabsTrigger value="all">All History</TabsTrigger>
          <TabsTrigger value="mine">My History</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          {/* Table Container */}
          <div
            className="border rounded-lg"
            style={{
              minHeight: `${pagination.pageSize * 48 + 56}px`,
            }}
          >
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => (
                      <th
                        key={header.id}
                        className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider h-[48px]`}
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
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell, index) => (
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

          {/* Pagination */}
          <div className="mt-4">
            <DataTablePagination
              table={table}
              pagination={pagination}
              setPagination={setPagination}
            />
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default RedemptionHistory;
