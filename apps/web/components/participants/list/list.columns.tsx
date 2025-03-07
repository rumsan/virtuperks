import { ColumnDef } from "@tanstack/react-table";

export function useColumns<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: "name",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Name</div>
      ),

      cell: ({ row }) => {
        return <p>Ram Thapa Magar</p>;
      },
    },
    {
      accessorKey: "walletAddress",
      header: () => (
        <div className="text-center text-gray-600 font-bold">
          Wallet Address
        </div>
      ),

      cell: ({ row }) => {
        return <p className="text-center">0x0ej394nf94jf04mo4</p>;
      },
    },
  ];
}
