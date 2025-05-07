import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu"
import {
  Clock2,
  Eye,
  FilePenLine,
  Mail,
  MoreHorizontal,
  Send,
  Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { capitalizeOnlyFirstLetter } from "@/utils/utils"
import {
  getAnnouncementShowOnStyles,
  shortenText,
} from "@/features/reminder/lib/lib" // reuse if same logic
import { format } from "date-fns"
import { deleteAnnouncement } from "@/features/announcement-offer/api/api"

type Announcement = {
  id: string
  title: string
  description: string
  message: string
  audience: string
  isImmediate: boolean
  scheduledAt: string
  showOn: string
  expiredAt: string
}

type AnnouncementCardProps = {
  announcement: Announcement
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
}) => {
  const router = useRouter()
  const fullMessage = announcement.message
  const shortMessage = shortenText(fullMessage)
  const { bg, dot, text } = getAnnouncementShowOnStyles(announcement.showOn)
  const displayDate = announcement.isImmediate
    ? "Immediately"
    : format(new Date(announcement.scheduledAt), "PPPp")

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition">
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900">{announcement.title}</p>
          {/* <div className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">
            {capitalizeOnlyFirstLetter(announcement.showOn)}
          </div> */}
          <div
            className={`flex gap-2 items-center text-[12px] py-[3px] px-3 rounded-lg ${bg} ${text}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${dot}`}></div>

            {capitalizeOnlyFirstLetter(announcement.showOn)}
          </div>
        </div>

        <p className="text-[13px] text-gray-700">{announcement.description}</p>

        <p className="flex items-center gap-2 text-[13px] text-gray-500 truncate">
          <Mail className="w-3.5 h-3.5 text-gray-400" />
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
        </p>

        <p className="flex items-center gap-2 text-[13px] text-gray-500">
          <Send className="w-3.5 h-3.5 text-gray-400" />
          Audience:{" "}
          {capitalizeOnlyFirstLetter(announcement.audience.replace("_", " "))}
        </p>

        <p className="flex items-center gap-2 text-[13px] text-gray-500">
          <Clock2 className="w-3.5 h-3.5 text-gray-400" />
          {displayDate}
        </p>

        <p className="text-[13px] text-gray-500">
          Expires in: {announcement.expiredAt.replace("_", " ").toLowerCase()}
        </p>
      </div>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="flex flex-col bg-white px-4 p-2 gap-2 shadow-md text-sm"
          >
            <DropdownMenuLabel className="flex gap-2 items-center justify-start">
              Action
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                router.push(`/announcement/view/${announcement.id}`)
              }
              className="flex gap-2 items-center justify-start"
            >
              <Eye className="h-4 w-4 text-blue-400 " /> View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(`/announcement/edit/${announcement.id}`)
              }
              className="flex gap-2 items-center justify-start"
            >
              <FilePenLine className="h-4 w-4 text-green-600" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // Add your delete handler here
                deleteAnnouncement(announcement)
                router.push("/reminders")
              }}
              className="flex gap-2 items-center justify-start"
            >
              <Trash2 className="h-4 w-4 text-red-600" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default AnnouncementCard
