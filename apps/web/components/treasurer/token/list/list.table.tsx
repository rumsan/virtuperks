import { DataTablePagination } from "@/components/common/list/list.pagination";
import SearchAction from "@/components/common/list/list.search";
import { ListTable } from "@/components/common/list/list.table";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Card } from "@workspace/ui/components/card";
import ListFilter from "./list.filter";

interface ListTableProps<T, TData> {
  columns: ColumnDef<T>[];
  table: Table<TData>;
  pagination: any;
  setPagination: any;
}

const TokenTable = <T, TData>({
  table,
  columns,
  pagination,
  setPagination,
}: ListTableProps<T, TData>) => {
  return (
    <div className="mt-4 mb-4">
      <div className="mb-5">
        <h1 className="font-bold text-xl">Token Allocation History</h1>
        <p className="text-sm text-gray-500">
          List of all the token assigned to this department
        </p>
      </div>
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <SearchAction />
          <ListFilter />
        </div>
        <ListTable table={table} columns={columns} />
        <hr />
        <DataTablePagination
          table={table}
          setPagination={setPagination}
          pagination={pagination}
        />
      </Card>
    </div>
  );
};

export default TokenTable;
