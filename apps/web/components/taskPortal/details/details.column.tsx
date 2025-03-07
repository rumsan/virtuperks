import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

export function useColumns<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: "title",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Title</div>
      ),

      cell: ({ row }) => {
        return <p></p>;
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Status</div>
      ),

      cell: ({ row }) => {
        return <p></p>;
      },
    },
    {
      accessorKey: "url",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Url</div>
      ),

      cell: ({ row }) => {
        return <p></p>;
      },
    },
    {
      accessorKey: "participant",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Participants</div>
      ),

      cell: ({ row }) => {
        return <p></p>;
      },
    },
    {
      accessorKey: "date",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Date</div>
      ),

      cell: ({ row }) => {
        return <p></p>;
      },
    },
    {
      accessorKey: "tokens",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Tokens</div>
      ),

      cell: ({ row }) => {
        return <p></p>;
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
