import hasRole from "@/utils/role";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck } from "lucide-react";

// interface ExtendedRewardRedemption extends RewardRedemption {
//   rewardRedemption: {
//     rewardRedemption: string;
//   };
// }

export function useColumns<
  T extends {
    redemptionId: string;
    status: number;
    from: string;
    blockTimestamp: string;
    transactionHash: string;
    rewardRedemption: { rewardRedemption: string };
  },
>(
  updateStatus: (params: {
    userAddress: string;
    rewardAddress: string;
    redemptionId: string;
  }) => void,
  isUpdating: boolean,
): ColumnDef<T>[] {
  const hasDefaultAdminRole = hasRole({
    role: process.env.NEXT_PUBLIC_DEFAULT_ADMIN_ROLE || "",
  });

  return [
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status === 1 ? "completed" : "pending";
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
        const wallet = row.original.from;
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
        const timestamp = Number(row.original.blockTimestamp) * 1000;
        const date = new Date(timestamp);
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
    {
      header: () => <div className="text-center w-full">Action</div>,
      id: "action",
      cell: ({ row }) => {
        const isCompleted = row.original.status === 1;

        return hasDefaultAdminRole ? (
          <div className="flex justify-center items-center w-full">
            <button
              onClick={() => {
                updateStatus({
                  userAddress: row.original.from,
                  rewardAddress: row.original.rewardRedemption.rewardRedemption,
                  redemptionId: row.original.redemptionId,
                });
              }}
              disabled={isUpdating || isCompleted}
              className={`p-1.5 rounded-full transition ${
                isUpdating || isCompleted
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-100"
              }`}
              title={isCompleted ? "Already Completed" : "Mark as Completed"}
            >
              <CircleCheck className="text-green-800" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center w-full">
            <CircleCheck className="text-green-800 opacity-20" />
          </div>
        );
      },
    },
  ];
}
