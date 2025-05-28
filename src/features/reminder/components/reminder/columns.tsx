import { useRouter } from "next/navigation"
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
  MoreHorizontal,
  Settings,
  Trash2,
  ArrowUpDown,
  MoreVertical,
} from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
// import { DataTableColumnHeader } from "@/components/shared/table/data-table-column-header";
// import { Customer, deleteCustomer } from "@/features/customer/api/api";
// import { capitalizeFirstChar } from "@/utils/utils";
import { getServices } from "@/features/service/api/api"
import { deleteReminder, Reminder } from "../../api/api"
import { getReminderTypeStyles, shortenText } from "../../lib/lib"
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"
import { DataTableColumnHeader } from "@/components/shared/table/data-table-column-header"
import { getActiveStatusStyles } from "@/features/service/lib/lib"
import { capitalizeOnlyFirstLetter } from "@/utils/utils"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const serviceData = await getServices()

export const reminderColumns: ColumnDef<Reminder>[] = [
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
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const fullMessage = row.getValue("description") as string
      const shortMessage = shortenText(fullMessage)

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-pointer">{shortMessage}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{fullMessage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },

  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const fullMessage = row.getValue("message") as string
      const shortMessage = shortenText(fullMessage)

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-pointer">{shortMessage}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{fullMessage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.original.type
      const { bg, dot, text } = getReminderTypeStyles(type)
      return (
        <div
          className={`w-[100px] flex gap-2 items-center text-[13px] py-[3px] px-3 rounded-lg ${bg} ${text}`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${dot}`}></div>
          {type === "FOLLOW_UP" ? "Follow up" : capitalizeOnlyFirstLetter(type)}
        </div>
      )
    },
  },
  {
    accessorKey: "services",
    header: "Services",
    cell: ({ row }) => {
      const services = row.getValue("services") as { title: string }[]
      const serviceTitles = services.map((s) => s.title).join(", ")

      const shortServiceTitles = shortenText(serviceTitles)

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-pointer">{shortServiceTitles}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{serviceTitles}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  //   {
  //     accessorKey: "serviceId",
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Service" />
  //     ),
  //     cell: ({ row }) => {
  //       const selectedService = serviceData?.find(
  //         (s: any) => s.id === row.original.services
  //       );
  //       return <div>{selectedService?.title || "N/A"}</div>;
  //     },
  //   },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const payment = row.original
      const router = useRouter()

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
            <DropdownMenuItem className="flex gap-2 items-center justify-start">
              <Eye className="h-4 w-4 text-blue-400 " /> View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/reminders/edit/${row.original.id}`)}
              className="flex gap-2 items-center justify-start"
            >
              <FilePenLine className="h-4 w-4 text-green-600" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                try {
                  await deleteReminder(row.original) // wait for delete to complete

                  toast.success("Reminder deleted successfully.") // ✅ success toast

                  setTimeout(() => {
                    window.location.reload() // 🔄 reload after short delay
                  }, 1000) // 1 second delay to let user see the toast
                } catch (error) {
                  toast.error("Failed to delete reminder.") // ❌ error toast
                }
              }}
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
