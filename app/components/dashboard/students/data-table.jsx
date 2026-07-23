"use client";

import * as React from "react";
import {
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
import { ChevronDownIcon } from "lucide-react";

/**
 * H6: server-paginated data table.
 *
 * Previously this component managed its own client-side `pageSize` state, called
 * `useReactTable` with only `getCoreRowModel()`, and had no `getPaginationRowModel()` —
 * so Previous/Next didn't do anything meaningful, and (separately, on the backend) the
 * API had no DEFAULT_PAGINATION_CLASS, so a course with a large roster loaded every
 * student into the browser in a single request regardless.
 *
 * Now that the backend paginates (see settings.py DEFAULT_PAGINATION_CLASS), this
 * component is "dumb": it renders whatever page of rows its parent gives it, and asks
 * the parent to fetch a different page via `onPageChange`. The parent (e.g. StudentsList)
 * owns the actual fetch call and DRF's {count, next, previous, results} response shape.
 *
 * Props:
 *   columns       - tanstack column defs (unchanged)
 *   data          - the CURRENT PAGE of rows only, not the full dataset
 *   pageIndex     - zero-based current page
 *   pageCount     - total number of pages (Math.ceil(count / pageSize))
 *   totalCount    - total row count across all pages (for the "Total Rows" label)
 *   onPageChange  - (newPageIndex) => void — parent fetches that page
 *   isLoading     - disables Prev/Next while a page fetch is in flight
 *   filterValue / onFilterChange - controlled search input (server-side filtering,
 *                   debounced by the parent if desired) — replaces the old decorative
 *                   filter input that had no onChange handler at all.
 */
const DataTable = React.forwardRef(
  (
    {
      columns,
      data,
      pageIndex = 0,
      pageCount = 1,
      totalCount = 0,
      onPageChange,
      isLoading = false,
      filterValue = "",
      onFilterChange,
    },
    ref
  ) => {
    const table = useReactTable({
      data: data || [],
      columns,
      manualPagination: true,
      pageCount,
      getCoreRowModel: getCoreRowModel(),
      state: { pagination: { pageIndex, pageSize: data?.length || 1 } },
    });

    React.useImperativeHandle(ref, () => ({
      getRowModel: () => table.getRowModel(),
    }));

    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex < pageCount - 1;

    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 py-2 px-4 lg:px-6">
          <Input
            placeholder="Filter by name or email..."
            className="max-w-full md:max-w-sm"
            value={filterValue}
            onChange={(e) => onFilterChange?.(e.target.value)}
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
            Total Rows: {totalCount}
          </span>
        </div>
        <div>
          <Table className="min-w-[800px]">
            <TableHeader className="sticky top-0 z-10 bg-background">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-xs md:text-sm whitespace-nowrap px-2 lg:px-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-xs md:text-sm">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
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
        <div className="flex flex-col md:flex-row md:justify-end gap-2 py-2 px-4 lg:px-6 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(pageIndex - 1)}
            disabled={!canPreviousPage || isLoading}
            className="w-full md:w-auto"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(pageIndex + 1)}
            disabled={!canNextPage || isLoading}
            className="w-full md:w-auto"
          >
            Next
          </Button>
          <span className="text-xs md:text-sm text-muted-foreground text-center md:text-right">
            Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
          </span>
        </div>
      </div>
    );
  }
);
DataTable.displayName = "DataTable";

export { DataTable };
