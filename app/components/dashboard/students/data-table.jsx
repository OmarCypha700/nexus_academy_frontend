"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { ChevronDownIcon } from "lucide-react";

const DataTable = React.forwardRef(({ columns, data }, ref) => {
  const [pageSize, setPageSize] = React.useState(10);

  const table = useReactTable({
    data: data || [], // Handle empty data
    columns,
    pageSize,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: (updater) => {
      const newState = typeof updater === "function" ? updater(table.getState()) : updater;
      setPageSize(newState.pageSize || pageSize);
    },
    state: { pagination: { pageSize, pageIndex: 0 } },
  });

  React.useImperativeHandle(ref, () => ({
    getRowModel: () => table.getRowModel(),
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4 py-2 px-4 lg:px-6">
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => setPageSize(parseInt(value))}
          className="w-full md:w-[150px]"
        >
          <SelectTrigger>
            <SelectValue placeholder="Rows per page" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Filter by name or email..."
          className="max-w-full md:max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full md:w-auto">Columns <ChevronDownIcon /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.columnDef.meta?.displayName || column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
          Total Rows: {data?.length || 0}
        </span>
      </div>
      <div>
        <Table className="min-w-[800px]">
          <TableHeader className="bg-black sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white text-xs md:text-sm whitespace-nowrap px-2 lg:px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="bg-gray-100 hover:bg-gray-300">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-xs md:text-sm py-2 md:py-3 whitespace-nowrap px-2 lg:px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-xs md:text-sm">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col md:flex-row md:justify-end gap-2 py-2 px-4 lg:px-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="w-full md:w-auto"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="w-full md:w-auto"
        >
          Next
        </Button>
        <span className="text-xs md:text-sm text-muted-foreground text-center md:text-right">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {Math.ceil((data?.length || 0) / pageSize) || 1}
        </span>
      </div>
    </div>
  );
});

export { DataTable };