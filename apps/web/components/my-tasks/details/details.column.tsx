import { ColumnDef } from "@tanstack/react-table";
import { TaskCreated } from "@workspace/sdk/type";
import { Eye } from "lucide-react";

export function useColumns<T = TaskCreated>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: "title",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Title</div>
      ),
      cell: (info) => <p>{String(info.getValue())}</p>,
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Status</div>
      ),
      cell: (info) => <p>{String(info.getValue())}</p>,
    },
    {
      accessorKey: "url",
      header: () => (
        <div className="text-left text-gray-600 font-bold">URL</div>
      ),
      cell: (info) => <p>{String(info.getValue())}</p>,
    },
    {
      accessorKey: "participant",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Participants</div>
      ),
      cell: (info) => <p>{String(info.getValue())}</p>,
    },
    {
      accessorKey: "date",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Date</div>
      ),
      cell: (info) => <p>{String(info.getValue())}</p>,
    },
    {
      accessorKey: "tokens",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Tokens</div>
      ),
      cell: (info) => <p>{String(info.getValue())}</p>,
    },
    {
      id: "actions",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Action</div>
      ),
      enableHiding: false,
      cell: () => <Eye />,
    },
  ];
}
