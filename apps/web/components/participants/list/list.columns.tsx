import { ParticipantLookupData } from "@/type/participantLookup.type";
import { ColumnDef } from "@tanstack/react-table";

export function useColumns({
  lookupByWallet,
  isLoading,
  isError,
}: {
  lookupByWallet: (wallet: string) => string;
  isLoading: boolean;
  isError: boolean;
}): ColumnDef<ParticipantLookupData>[] {
  return [
    {
      accessorKey: "wallet",
      header: () => (
        <div className="text-left text-xs font-semibold uppercase text-gray-500">
          Wallet Address
        </div>
      ),
      cell: ({ row }) => (
        <p className="text-sm font-mono text-gray-800 break-all">
          {row.original.wallet}
        </p>
      ),
    },
    {
      accessorKey: "name",
      header: () => (
        <div className="text-left text-xs font-semibold uppercase text-gray-500">
          Name
        </div>
      ),
      cell: ({ row }) => (
        <p className="text-sm font-mono text-gray-700">
          {isLoading
            ? "Loading..."
            : isError
              ? "Error fetching name"
              : lookupByWallet(row.original.wallet)}
        </p>
      ),
    },
  ];
}
