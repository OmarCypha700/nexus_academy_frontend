// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import { Button } from "@/app/components/ui/button";
// import { ArrowUpDown } from "lucide-react";
// import { Checkbox } from "@/app/components/ui/checkbox";
// import { useRouter } from "next/navigation";
// import { MoreHorizontal } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/app/components/ui/dropdown-menu";

// export const columns = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//         className="h-4 w-4"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//         className="h-4 w-4"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//     meta: {
//       displayName: "Select",
//     },
//   },
//   {
//     accessorKey: "student.name",
//     id: "student.name",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         className="text-sm md:text-base"
//       >
//         Name
//         <ArrowUpDown className="ml-1 h-3 w-3 md:h-4 md:w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => (
//       <div className="text-sm md:text-base">
//         {row.original.student?.name || "N/A"}
//       </div>
//     ),
//     filterFn: (row, id, value) => {
//       return (
//         row.original.student?.name
//           ?.toLowerCase()
//           .includes(value.toLowerCase()) || false
//       );
//     },
//     meta: {
//       displayName: "Name",
//     },
//   },
//   {
//     accessorKey: "student.email",
//     id: "student.email",
//     header: "Email",
//     cell: ({ row }) => (
//       <div className="text-sm md:text-base">
//         {row.original.student?.email || "N/A"}
//       </div>
//     ),
//     filterFn: (row, id, value) => {
//       return (
//         row.original.student?.email
//           ?.toLowerCase()
//           .includes(value.toLowerCase()) || false
//       );
//     },
//     meta: {
//       displayName: "Email",
//     },
//   },
//   {
//     accessorKey: "progress.progress_percent",
//     id: "progress.progress_percent",
//     header: "Progress (%)",
//     cell: ({ row }) => (
//       <div className="text-sm md:text-base">
//         {row.original.progress?.progress_percent || 0}%
//       </div>
//     ),
//     meta: {
//       displayName: "Progress (%)",
//     },
//   },
//   {
//     accessorKey: "enrolled_at",
//     id: "enrolled_at",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         className="text-sm md:text-base"
//       >
//         Enrolled
//         <ArrowUpDown className="ml-1 h-3 w-3 md:h-4 md:w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => (
//       <div className="text-sm md:text-base">
//         {new Date(row.original.enrolled_at)?.toLocaleDateString() || "N/A"}
//       </div>
//     ),
//     meta: {
//       displayName: "Enrolled",
//     },
//   },
//   {
//     id: "actions",
//     header: "Actions",
//     cell: ({ row }) => {
//       const router = useRouter();
//       const student = row.original;
//       return (
//         <div className="space-x-2">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel className={"bg-black text-white rounded-lg"}>
//                 Actions
//               </DropdownMenuLabel>
//               <DropdownMenuItem
//                 onClick={() =>
//                   navigator.clipboard.writeText(student.student?.name)
//                 }
//               >
//                 Copy Name
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 onClick={() =>
//                   navigator.clipboard.writeText(student.student?.email)
//                 }
//               >
//                 Copy Email
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={() =>
//                   router.push(`/dashboard/instructor/students/${student.id}`)
//                 }
//               >
//                 View details
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={() =>
//                   alert(
//                     `Initiate chat with ${student.student?.name || "Unknown"}`
//                   )
//                 }
//               >
//                 Message Student
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       );
//     },
//     meta: {
//       displayName: "Actions",
//     },
//   },
// ];

"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { useState } from "react";
import axiosInstance from "@/app/lib/axios";

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
      const [subject, setSubject] = useState("");
      const [message, setMessage] = useState("");
      const [isSending, setIsSending] = useState(false);

      const handleSendMessage = async () => {
        if (!subject || !message) {
          toast({
            title: "Error",
            description: "Subject and message are required.",
            variant: "destructive",
          });
          return;
        }

        setIsSending(true);
        try {
          await axiosInstance.post("/api/messages/send/", {
            recipient_email: student.student?.email,
            subject,
            message,
          });
          toast({
            title: "Success",
            description: "Message sent successfully!",
          });
          setIsDialogOpen(false);
          setSubject("");
          setMessage("");
        } catch (error) {
          console.error("Error sending message:", error);
          toast({
            title: "Error",
            description: "Failed to send message. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsSending(false);
        }
      };

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
              <DropdownMenuLabel className="bg-black text-white rounded-lg">
                Actions
              </DropdownMenuLabel>
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Message to {student.student?.name || "Student"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label htmlFor="recipient" className="text-sm font-medium">
                    Recipient
                  </label>
                  <Input
                    id="recipient"
                    value={student.student?.email || ""}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter subject"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    className="mt-1"
                    rows={5}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSending}
                >
                  Cancel
                </Button>
                <Button onClick={handleSendMessage} disabled={isSending}>
                  {isSending ? "Sending..." : "Send"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
    meta: {
      displayName: "Actions",
    },
  },
];