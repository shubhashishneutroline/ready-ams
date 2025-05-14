"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Eye,
  FilePenLine,
  Trash2,
  Settings,
  MoreHorizontal,
} from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/shared/table/data-table-column-header"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { capitalizeFirstChar, capitalizeOnlyFirstLetter } from "@/utils/utils"

// Define columns for the payment table
export const ticketColumns = (
  handleEdit: (ticket: any) => void
): ColumnDef<any>[] => [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "ticketDescription",
    header: "Description",
  },

  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.original.category
      return <div className=" ">{capitalizeOnlyFirstLetter(category)}</div>
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = row.original.priority
      return <div className="">{capitalizeOnlyFirstLetter(priority)}</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      return <div className="">{capitalizeOnlyFirstLetter(status)}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div>{format(date, "dd MMMM yyyy")}</div>
    },
  },
  // {
  //   accessorKey: "selectedTime",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Time" />
  //   ),
  //   cell: ({ row }) => {
  //     const time = new Date(row.getValue("selectedTime"));
  //     return <div>{format(time, "hh:mm a")}</div>;
  //   },
  // },

  {
    id: "actions",
    // Actions dropdown for each row
    cell: ({ row }) => {
      const router = useRouter()
      // Return the actions dropdown menu for each payment row
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel className="flex gap-2 items-center justify-start">
              Action
              <Settings className="h-4 w-4" />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* View payment action */}
            <DropdownMenuItem
              onClick={() =>
                router.push(`/appointment/view/${row.original.id}`)
              }
              className="flex gap-2 items-center justify-start"
            >
              <Eye className="h-4 w-4 text-blue-400" /> View
            </DropdownMenuItem>
            {/* Edit payment action */}
            <DropdownMenuItem
              onClick={() => {
                handleEdit(row.original) // 🔥 trigger modal here
              }}
              className="flex gap-2 items-center justify-start"
            >
              <FilePenLine className="h-4 w-4 text-green-600" /> Edit
            </DropdownMenuItem>
            {/* Delete payment action */}
            <DropdownMenuItem
              //   onClick={() => deleteAppointment(row.original)}
              className="flex gap-2 items-center justify-start"
            >
              <Trash2 className="h-4 w-4 text-red-600" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
