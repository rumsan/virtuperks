import { ColumnDef } from "@tanstack/react-table";

type TableType = "transfer" | "disbursement";

export function useColumns(type: TableType): ColumnDef<any>[] {
  if (type === "transfer") {
    console.log("Type: ", type);
    return [
      {
        accessorKey: "remarks",
        header: "Remarks",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.remarks ?? "N/A"}</span>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.amount}</span>
        ),
      },
      {
        accessorKey: "id",
        header: "Transfer ID",
        cell: ({ row }) => {
          const id = row.original.id;
          const formattedId = id
            ? `${id.slice(0, 20)}...${id.slice(-5)}`
            : "N/A";
          return <span className="text-sm">{formattedId}</span>;
        },
      },

      {
        accessorKey: "to",
        header: "To",
        cell: ({ row }) => <span className="text-sm">{row.original.to}</span>,
      },
    ];
  }

  return [
    {
      accessorKey: "id",
      header: "Disbursement ID",
      cell: ({ row }) => <span className="text-sm">{row.original.id}</span>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <span className="text-sm">{row.original.amount}</span>,
    },
    {
      accessorKey: "disbursedBy",
      header: "Disbursed By",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.disbursedBy}</span>
      ),
    },
  ];
}
