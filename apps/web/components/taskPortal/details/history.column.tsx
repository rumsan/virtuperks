import { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";

export function useHistoryColumns<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: "activity",
      header: () => (
        <div className="text-left text-[#475569] font-bold">Activity</div>
      ),

      cell: ({ row }) => {
        return (
          <p className="text-[#3D3D5A] text-sm">{row.getValue("activity")}</p>
        );
      },
    },

    {
      accessorKey: "date",
      header: () => (
        <div className="text-left text-[#475569] font-bold">Date</div>
      ),

      cell: ({ row }) => {
        return <p className="text-[#3D3D5A] text-sm">{row.getValue("date")}</p>;
      },
    },
    {
      accessorKey: "walletAddress",
      header: () => (
        <div className="text-left text-[#475569] font-bold">Wallet Address</div>
      ),

      cell: ({ row }) => {
        return (
          <p className="flex items-center text-[#3D3D5A] text-sm gap-1">
            <span>{row.getValue("walletAddress")}</span>
            <Copy size={14} strokeWidth={3} color="#94A3B8" />
          </p>
        );
      },
    },

    {
      accessorKey: "transactionHash",
      header: () => (
        <div className="text-left text-[#475569] font-bold">
          Tnx Hash
        </div>
      ),

      cell: ({ row }) => {
        return (
          <p className="flex items-center text-[#3D3D5A] text-sm gap-1">
            <span>{row.getValue("transactionHash")}</span>
            <Copy size={14} strokeWidth={3} color="#94A3B8" />
          </p>
        );
      },
    },
  ];
}
