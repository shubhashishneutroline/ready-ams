"use client"
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
import { Reminder } from "../../api/api"
import {
  getAnnouncementShowOnStyles,
  getAudienceLabel,
  getBadgeColor,
  shortenText,
} from "../../lib/lib"
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AnnouncementOrOffer } from "@/features/announcement-offer/types/types"
import { DataTableColumnHeader } from "@/components/shared/table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { deleteAnnouncement } from "@/features/announcement-offer/api/api"
import { capitalizeOnlyFirstLetter } from "@/utils/utils"
import { toast } from "sonner"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// {
// 		"id": "cm9r09fy40000vd6ssay9js5j",
// 		"title": "New Summer Discount!",
// 		"description": "Get 20% off all services this summersss.",
// 		"message": "Use winters222 all at checkout.",
// 		"audience": "APPOINTED_USERS",
// 		"isImmediate": false,
// 		"scheduledAt": "2025-04-18T01:31:39.979Z",
// 		"showOn": "EMAIL",
// 		"expiredAt": "ONE_DAY",
// 		"createdAt": "2025-04-21T11:41:18.459Z",
// 		"updatedAt": "2025-04-21T11:41:44.051Z"
// 	},

export const formatDateAndTime = (dateString: string) => {
  const date = new Date(dateString)

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return { formattedDate, formattedTime }
}
const serviceData = await getServices()

export const announcementColumns: ColumnDef<AnnouncementOrOffer>[] = [
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
    accessorKey: "audience",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Audience" />
    ),
    cell: ({ row }) => {
      const type = row.original.audience
      const { bg, dot, text } = getBadgeColor(type)
      return (
        <div
          className={`w-[100px] flex gap-2 items-center text-[13px] py-[3px] px-3 rounded-lg ${bg} ${text}`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${dot}`}></div>
          {getAudienceLabel(type)}
        </div>
      )
    },
  },
  {
    accessorKey: "showOn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Show On" />
    ),
    cell: ({ row }) => {
      const type = row.original.showOn
      const { bg, dot, text } = getAnnouncementShowOnStyles(type)
      return (
        <div
          className={`w-[100px] flex gap-2 items-center text-[13px] py-[3px] px-3 rounded-lg ${bg} ${text}`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${dot}`}></div>
          {capitalizeOnlyFirstLetter(type)}
        </div>
      )
    },
  },
  // {
  //   accessorKey: "isImmediate",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Immediately" />
  //   ),
  //   cell: ({ row }) => {
  //     const isImmediate = row.getValue("isImmediate") as boolean;

  //     const getImmediateLabel = (value: boolean) => {
  //       switch (value) {
  //         case true:
  //           return "Active";
  //         default:
  //           return "In-Active";
  //       }
  //     };

  //     const getImmediateVariant = (value: boolean) => {
  //       switch (value) {
  //         case true:
  //           return "default"; // primary badge
  //         case false:
  //           return "destructive"; // red badge
  //         default:
  //           return "outline"; // outlined badge
  //       }
  //     };

  //     return (
  //       <Badge variant={getImmediateVariant(isImmediate)}>
  //         {getImmediateLabel(isImmediate)}
  //       </Badge>
  //     );
  //   },
  // },
  {
    accessorKey: "scheduledAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Scheduled At" />
    ),
    cell: ({ row }) => {
      const scheduledAt = row.getValue("scheduledAt") as string
      const { formattedDate, formattedTime } = formatDateAndTime(scheduledAt)

      return (
        <div className="flex flex-col">
          <span>{formattedDate}</span>
          <span className="text-muted-foreground text-xs">{formattedTime}</span>
        </div>
      )
    },
  },
  //   {
  //     accessorKey: "services",
  //     header: "Services",
  //     cell: ({ row }) => {
  //       const services = row.getValue("services") as { title: string }[];
  //       const serviceTitles = services.map((s) => s.title).join(", ");

  //       const shortServiceTitles = shortenText(serviceTitles);

  //       return (
  //         <TooltipProvider>
  //           <Tooltip>
  //             <TooltipTrigger asChild>
  //               <span className="cursor-pointer">{shortServiceTitles}</span>
  //             </TooltipTrigger>
  //             <TooltipContent>
  //               <p className="max-w-xs">{serviceTitles}</p>
  //             </TooltipContent>
  //           </Tooltip>
  //         </TooltipProvider>
  //       );
  //     },
  //   },
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
                  await deleteAnnouncement(row.original)
                  // await deleteReminder(row.original) // wait for delete to complete

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
