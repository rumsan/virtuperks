import { DataTablePagination } from "@/components/common/list/list.pagination";
import { ListTable } from "@/components/common/list/list.table";
import {
  useGetDisbursements,
  useGetTokenTransfers,
} from "@/hooks/subgraph/token";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Card } from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Dispatch, SetStateAction } from "react";
import { useColumns } from "./details.column";

interface Pagination {
  pageIndex: number;
  pageSize: number;
}

interface ListTableProps<T> {
  pagination: Pagination;
  cuid: any;
  setPagination: Dispatch<SetStateAction<Pagination>>;
  filterTab: "direct" | "task";
  setFilterTab: (tab: "direct" | "task") => void;
}

const DepartmentDetailsTable = <T extends { type?: string }>({
  pagination,
  setPagination,
  cuid,
  filterTab,
  setFilterTab,
}: ListTableProps<T>) => {
  const { data: disbursementData } = useGetDisbursements(cuid);
  const { data: tokenTransferData } = useGetTokenTransfers(cuid);

  const transferList =
    tokenTransferData?.rewardManagementCreateds?.[0]?.tokenTransfers ?? [];

  const disbursementList =
    disbursementData?.rewardManagementCreateds?.[0]?.disbursements ?? [];

  console.log("Transfer List: ", transferList);
  console.log("Disbursement List: ", disbursementData);

  const transferColumns = useColumns("transfer");
  const disbursementColumns = useColumns("disbursement");

  const directTable = useReactTable({
    data: transferList,
    columns: transferColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(transferList.length / pagination.pageSize),
    state: { pagination },
    onPaginationChange: setPagination,
  });

  const taskTable = useReactTable({
    data: disbursementList,
    columns: disbursementColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(disbursementList.length / pagination.pageSize),
    state: { pagination },
    onPaginationChange: setPagination,
  });

  return (
    <div className="mt-4 mb-4">
      <div className="mb-5">
        <h1 className="font-bold text-xl">Token Allocation History</h1>
        <p className="text-sm text-gray-500">
          List of all the tokens allocated to this department
        </p>
      </div>

      <Tabs
        value={filterTab}
        onValueChange={(value) => {
          if (value === "direct" || value === "task") {
            setPagination({ pageIndex: 0, pageSize: pagination.pageSize }); // reset to first page
            setFilterTab(value);
          }
        }}
      >
        <div className="inline-block bg-blue-50 p-2 rounded-md">
          <TabsList className="flex gap-5">
            <TabsTrigger
              value="direct"
              className="px-4 py-2 text-sm rounded-md"
            >
              Direct Transferred
            </TabsTrigger>
            <TabsTrigger value="task" className="px-4 py-2 text-sm rounded-md ">
              Task Token
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="direct">
          <Card className="p-4">
            <ListTable table={directTable} columns={transferColumns} />
            <hr />
            <DataTablePagination
              table={directTable}
              pagination={pagination}
              setPagination={setPagination}
            />
          </Card>
        </TabsContent>

        <TabsContent value="task">
          <Card className="p-4">
            <ListTable table={taskTable} columns={disbursementColumns} />
            <hr />
            <DataTablePagination
              table={taskTable}
              pagination={pagination}
              setPagination={setPagination}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentDetailsTable;
