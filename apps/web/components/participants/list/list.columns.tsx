import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

export function useColumns<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: "name",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Name</div>
      ),

      cell: ({ row }) => {
        return <p>Hello Name</p>;
      },
    },
    {
      accessorKey: "email",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Email</div>
      ),

      cell: ({ row }) => {
        return <p>hello@gmail.com</p>;
      },
    },
    {
      accessorKey: "walletAddress",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Wallet Address</div>
      ),

      cell: ({ row }) => {
        return <p>0x0ej394nf94jf04mo4</p>;
      },
    },
    {
      accessorKey: "gender",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Gender</div>
      ),

      cell: ({ row }) => {
        return <p>Female</p>;
      },
    },
    {
      accessorKey: "manager",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Manager</div>
      ),

      cell: ({ row }) => {
        return <p>Manager A</p>;
      },
    },
    {
      accessorKey: "userRole",
      header: () => (
        <div className="text-left text-gray-600 font-bold">User Role</div>
      ),

      cell: ({ row }) => {
        return <p>Owner</p>;
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
