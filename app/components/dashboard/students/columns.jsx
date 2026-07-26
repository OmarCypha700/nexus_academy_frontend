"use client";

import { Button } from "@/app/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/app/components/ui/checkbox";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useState } from "react";
import { SendMessageDialog } from "@/app/components/dashboard/students/SendMessageDialog";

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
    meta: {
      displayName: "Select",
    },
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
    cell: ({ row }) => (
      <div className="text-sm md:text-base">
        {row.original.student?.name || "N/A"}
      </div>
    ),
    filterFn: (row, id, value) => {
      return (
        row.original.student?.name
          ?.toLowerCase()
          .includes(value.toLowerCase()) || false
      );
    },
    meta: {
      displayName: "Name",
    },
  },
  {
    accessorKey: "student.email",
    id: "student.email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-sm md:text-base">
        {row.original.student?.email || "N/A"}
      </div>
    ),
    filterFn: (row, id, value) => {
      return (
        row.original.student?.email
          ?.toLowerCase()
          .includes(value.toLowerCase()) || false
      );
    },
    meta: {
      displayName: "Email",
    },
  },
  {
    accessorKey: "progress.progress_percent",
    id: "progress.progress_percent",
    header: "Progress (%)",
    cell: ({ row }) => (
      <div className="text-sm md:text-base">
        {row.original.progress?.progress_percent || 0}%
      </div>
    ),
    meta: {
      displayName: "Progress (%)",
    },
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
      <div className="text-sm md:text-base">
        {new Date(row.original.enrolled_at)?.toLocaleDateString() || "N/A"}
      </div>
    ),
    meta: {
      displayName: "Enrolled",
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const router = useRouter();
      const student = row.original;
      const [isDialogOpen, setIsDialogOpen] = useState(false);

      return (
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(student.student?.name)
                }
              >
                Copy Name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(student.student?.email)
                }
              >
                Copy Email
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/instructor/students/${student.id}`)
                }
              >
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                Message Student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SendMessageDialog
            student={student}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          />
        </div>
      );
    },
    meta: {
      displayName: "Actions",
    },
  },
];
