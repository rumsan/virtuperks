import { formatDate } from "@/utils/formatDate";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";

interface RowData {
  taskDetail: {
    detailsUrl: string;
    rewardAmount: number;
    isActive: boolean;
    expiryDate: number
  };
  createdBy: string;
  tresurerName: string;
  date: string;
  tokens: number;
}

export function useColumns<T extends RowData>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: "createdBy",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Title</div>
      ),

      cell: ({ row }) => {
        const getTaskName = row.original.taskDetail.detailsUrl;
        
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              {getTaskName}
            </span>
          </div>


        );
      },
    },
    {
      accessorKey: "Reward Amount",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Reward Amount</div>
      ),

      cell: ({ row }) => {
       
        const getAmount = row.original.taskDetail.rewardAmount;
        return (
          <p className="text-sm text-gray-700">
            {getAmount} RTH
          </p>
        )
      },
    },
    {
      accessorKey: "date",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Expire Date</div>
      ),

      cell: ({ row}) => {
        const getData = row.original.taskDetail.expiryDate;
       const formattedData = formatDate(getData);
      
        return (
          <p className="text-sm text-gray-700">
            {formattedData}
          </p>)
      },
    },
    {
      accessorKey: "tokens",
      header: () => (
        <div className="text-left text-gray-600 font-bold">Status</div>
      ),
cell: ({ row }) => {
  const getStatus = row.original.taskDetail.isActive;
  return (
    <p
      className={`text-sm ${
        getStatus ? "text-green-600" : "text-red-800"
      }`}
    >
      {getStatus ? "Active" : "Inactive"}
    </p>
  );
},
     
    },
    // {
    //   id: "actions",
    //   header: () => (
    //     <div className="text-left text-gray-600 font-bold">Action</div>
    //   ),
    //   enableHiding: false,
    //   cell: () => {
    //     return (
    //       <p>
    //         <Eye />
    //       </p>
    //     );
    //   },
    // },
  ];
}
