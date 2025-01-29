"use client";

import { ColumnDef, flexRender, Table } from "@tanstack/react-table";
import {
  TableBody,
  TableCell,
  Table as TableDom,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

interface ListTableProps<T, TData> {
  columns: ColumnDef<T>[];
  table: Table<TData>;
  handleRowClick?: (row: any) => void;
}

export function ListTable<T, TData>({
  table,
  columns,
  handleRowClick,
}: ListTableProps<T, TData>) {
  if (!table.getHeaderGroups) {
    console.error("Invalid table object passed:", table);
    return <div>Error: Invalid table object.</div>;
  }

  return (
    <TableDom className="w-full mt-4">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead className="text-sm text-black-900" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              className="text-sm text-black-900 cursor-pointer h-5"
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              onClick={() => handleRowClick && handleRowClick(row)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow className="h-96">
            <TableCell colSpan={columns.length} className="text-center">
              {/* <NoDataPreivew /> */}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </TableDom>
  );
}
