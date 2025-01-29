import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

export function useColumns<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: "topic",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Topic</div>
      ),

      cell: ({ row }) => {
        return <p>Token Allocation</p>;
      },
    },
    {
      accessorKey: "date",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Date</div>
      ),

      cell: ({ row }) => {
        return <p>January 28th, 2025</p>;
      },
    },
    {
      accessorKey: "tokens",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Tokens</div>
      ),

      cell: ({ row }) => {
        return <p>100</p>;
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
          <p>
            <Eye />
          </p>
        );
      },
    },
  ];
}
