// components/dashboard/students/columns.jsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/app/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/app/components/ui/checkbox";
import { useRouter } from "next/navigation";

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="h-4 w-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="h-4 w-4"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "student.name",
    id: "student.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-sm md:text-base"
      >
        Name
        <ArrowUpDown className="ml-1 h-3 w-3 md:h-4 md:w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      console.log("Row data:", row.original);
      return <div className="text-sm md:text-base">{row.original.student?.name || "N/A"}</div>;
    },
    filterFn: (row, id, value) => {
      return row.original.student?.name?.toLowerCase().includes(value.toLowerCase()) || false;
    },
  },
  {
    accessorKey: "student.email",
    id: "student.email",
    header: "Email",
    cell: ({ row }) => <div className="text-sm md:text-base">{row.original.student?.email || "N/A"}</div>,
    filterFn: (row, id, value) => {
      return row.original.student?.email?.toLowerCase().includes(value.toLowerCase()) || false;
    },
  },
  {
    accessorKey: "progress.progress_percent",
    id: "progress.progress_percent",
    header: "Progress (%)",
    cell: ({ row }) => <div className="text-sm md:text-base">{row.original.progress?.progress_percent || 0}%</div>,
  },
  {
    accessorKey: "enrolled_at",
    id: "enrolled_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-sm md:text-base"
      >
        Enrolled
        <ArrowUpDown className="ml-1 h-3 w-3 md:h-4 md:w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm md:text-base">{new Date(row.original.enrolled_at)?.toLocaleDateString() || "N/A"}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const router = useRouter();
      const student = row.original;
      return (
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/instructor/students/${student.id}`)}
            disabled={!student.id}
            className="text-xs md:text-sm"
          >
            View Details
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => alert(`Initiate chat with ${student.student?.name || "Unknown"}`)}
            disabled={!student.student?.name}
            className="text-xs md:text-sm"
          >
            Message
          </Button>
        </div>
      );
    },
  },
];