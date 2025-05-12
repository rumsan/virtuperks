import { ColumnDef } from "@tanstack/react-table";

type Participant = {
  account: string;
  role: string;
};

export function useColumns(): ColumnDef<Participant>[] {
  return [
    {
      accessorKey: "account",
      header: () => (
        <div className="text-left text-xs font-semibold uppercase text-gray-500 tracking-wider">
          Wallet Address
        </div>
      ),
      cell: ({ row }) => (
        <div className="mb-1">
          <p className="text-sm font-mono text-gray-800 break-all">
            {row.original.account}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: () => (
        <div className="text-left text-xs font-semibold uppercase text-gray-500 tracking-wider">
          Role
        </div>
      ),
      cell: () => (
        <div className="mt-1">
          <p className="text-sm font-mono text-gray-700">{"Participant"}</p>
        </div>
      ),
    },
  ];
}
