import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, CircleX, Copy } from "lucide-react";

export function useColumns<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: "walletAddress",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Wallet Address</div>
      ),

      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              {row.getValue("walletAddress")}
            </span>
            <Copy color="#94A3B8" size={16} strokeWidth={2.75} />
          </div>
        );
      },
    },

    {
      id: "actions",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Action</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <span className="flex items-center gap-1">
            <CircleCheck color="#03AB65" strokeWidth={1.5} size={28} />
            <CircleX color="#E44134" strokeWidth={1.5} size={28} />
          </span>
        );
      },
    },
  ];
}
