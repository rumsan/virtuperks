import { DataTablePagination } from "@/components/common/list/list.pagination";
import { ListTable } from "@/components/common/list/list.table";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Search } from "lucide-react";

interface ListTableProps<T, TData> {
  columns: ColumnDef<T>[];
  table: Table<TData>;
  pagination: any;
  setPagination: any;
}

const TreasurerDetailsTable = <T, TData>({
  table,
  columns,
  pagination,
  setPagination,
}: ListTableProps<T, TData>) => {
  return (
    <>
      <div className="flex flex-col gap-1 mt-3 mb-4">
        <h3 className="font-bold">Token Allocation History</h3>
        <h4 className="text-gray-500 font-normal text-sm">
          List of all the token allocated of this department
        </h4>
      </div>
      <Card className="p-4">
        <div className="w-full h-10 flex rounded-md border border-gray-200 rounded-md items-center p-3">
          <p className="text-gray-500">
            <Search size={20} strokeWidth={2.75} />
          </p>
          <Input
            type="text"
            placeholder="Search"
            className="border-none focus:outline-none"
          />
        </div>

        <ListTable table={table} columns={columns} />
        <DataTablePagination
          table={table}
          setPagination={setPagination}
          pagination={pagination}
        />
      </Card>
    </>
  );
};

export default TreasurerDetailsTable;
