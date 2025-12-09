import { ColumnDef } from "@tanstack/react-table";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export type Participant = {
  cuid: string;
  name: string;
  address: string;
};

export function useColumns(): ColumnDef<Participant>[] {
  return [
    {
      accessorKey: "name",
      header: () => (
        <div className="px-2 py-2 text-left text-sm font-semibold uppercase text-gray-500 tracking-wide">
          Name
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-2 py-1">
          <p className="text-sm font-medium text-gray-900">{row.original.name}</p>
        </div>
      ),
    },

    {
      accessorKey: "address",
      header: () => (
        <div className="px-2 py-2 text-left text-sm font-semibold uppercase text-gray-500 tracking-wide">
          Wallet Address
        </div>
      ),
      cell: ({ row }) => {
        const [copied, setCopied] = useState(false);

        const copyToClipboard = () => {
          navigator.clipboard.writeText(row.original.address);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        };

        return (
          <div className="px-1 py-1 flex items-center gap-1">
            <p className="text-sm font-medium text-gray-700 break-all">
              {row.original.address}
            </p>

            <button
              onClick={copyToClipboard}
              className="p-1 hover:bg-gray-200 rounded-md transition"
            >
              {copied ? (
                <Check size={16} className="text-green-600" />
              ) : (
                <Copy size={16} className="text-gray-500" />
              )}
            </button>
          </div>
        );
      },
    },

    {
      accessorKey: "role",
      header: () => (
        <div className="px-2 py-2 text-left text-sm font-semibold uppercase text-gray-500 tracking-wide">
          Role
        </div>
      ),
      cell: () => (
        <div className="px-2 py-1">
          <p className="text-sm font-medium text-gray-900">Participant</p>
        </div>
      ),
    },
  ];
}



