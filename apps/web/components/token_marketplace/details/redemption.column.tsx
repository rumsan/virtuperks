import { ColumnDef } from "@tanstack/react-table";

interface TokenReward {
  status: number;
  from: string;
  blockTimestamp: string | number;
  transactionHash: string;
  [key: string]: any;
}

export function useColumns(): ColumnDef<TokenReward>[] {
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
        return date.toLocaleDateString(); // Could use toLocaleString() for full date/time
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
}
