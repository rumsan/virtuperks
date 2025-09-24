import hasRole from "@/utils/role";
import { RedemptionWithRelations } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Loader } from "lucide-react";

export function useColumns(
  requestToOfframp: (params: {
    tokenAmount: number;
    paymentProviderId: string;
    transactionHash: string;
    senderAddress: string;
    paymentDetails: Record<string, any>;
  }) => void,
  updatingId: string | null,
  paymentProviderId?: string,
): ColumnDef<RedemptionWithRelations>[] {
  const adminRole = process.env.NEXT_PUBLIC_DEFAULT_ADMIN_ROLE;
  const hasDefaultAdminRole = hasRole({
    role: adminRole || "",
  });

  return [
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        const statusDisplay = status?.toLowerCase() || "pending";
        const isCompleted = status === "SUCCESS";

        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              isCompleted
                ? "bg-green-100 text-green-700"
                : status === "FAILED" || status === "REJECTED"
                  ? "bg-red-100 text-red-700"
                  : status === "PROCESSING"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {statusDisplay}
          </span>
        );
      },
    },
    {
      header: "Wallet",
      accessorKey: "phone.userWalletAddress",
      cell: ({ row }) => {
        const wallet = row.original.phone?.userWalletAddress;
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
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const createdAt = row.original.createdAt;
        const date = new Date(createdAt);
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
        console.log(row.original, "row");
        const isCompleted = row.original.status === "SUCCESS";
        const isButtonLoading = updatingId === row.original.cuid;
        //TODO:NEED TO CALL OFFRAMP SERVICE HERE

        return hasDefaultAdminRole ? (
          <div className="flex justify-center items-center w-full">
            <button
              onClick={() => {
                if (isButtonLoading || isCompleted) return; // prevent accidental triggers
                requestToOfframp({
                  tokenAmount: row.original.reward?.tokens || 0,
                  paymentProviderId: paymentProviderId || "",
                  transactionHash: row.original.transactionHash || "",
                  senderAddress: row.original.reward?.wallet || "",
                  paymentDetails: {
                    //TODO:NEED TO CALL OFFRAMP SERVICE HERE
                  },
                });
              }}
              disabled={isButtonLoading || isCompleted}
              className={`p-2 rounded-full transition ${
                isButtonLoading || isCompleted
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-green-300"
              }`}
              title={
                isCompleted
                  ? "Already marked as completed"
                  : isButtonLoading
                    ? "Updating..."
                    : "Mark as Completed"
              }
            >
              {isButtonLoading ? (
                <Loader className="w-6 h-6 text-green-800 animate-spin" />
              ) : isCompleted ? (
                // Different icon when disabled (completed state)
                <CircleCheck className="w-6 h-6 text-gray-400" />
              ) : (
                // Default active icon
                <CircleCheck className="w-6 h-6 text-green-800" />
              )}
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center w-full">
            <span
              className="relative group cursor-not-allowed"
              title="You don't have permission to update"
            >
              <CircleCheck className="w-6 h-6 text-green-800 opacity-50 " />
            </span>
          </div>
        );
      },
    },
  ];
}
