import { Button } from "@/components/ui/button"

import {
  formatOffset,
  getReminderTypeStyles,
  shortenText,
} from "@/features/reminder/lib/lib"
import { deleteService } from "@/features/service/api/api"
import {
  formatDuration,
  getActiveStatusStyles,
} from "@/features/service/lib/lib"

import { capitalizeOnlyFirstLetter } from "@/utils/utils"
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
  MoreHorizontal,
  Send,
  Settings,
  Trash2,
  UserRoundCheck,
} from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { deleteReminder } from "../../api/api"

type ReminderCardProps = {
  reminder: any
  filterType: string
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  filterType,
}: ReminderCardProps) => {
  const router = useRouter()
  const { bg, dot, text } = getReminderTypeStyles(reminder.type)
  const initials = reminder.title
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
  const avatarUrl = ""
  const fullMessage = reminder.message as string

  const shortMessage = shortenText(fullMessage)
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition">
      {/* This needs to be completed */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900">{reminder.title}</p>
          <div
            className={`flex gap-2 items-center text-[12px] py-[3px] px-3 rounded-lg ${bg} ${text}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${dot}`}></div>
            {reminder.type === "FOLLOW_UP"
              ? "Follow Up"
              : capitalizeOnlyFirstLetter(reminder.type)}
          </div>
        </div>
        <p className="flex items-center gap-2 text-[13px] text-gray-500 truncate">
          <Send className="w-3.5 h-3.5 text-gray-400" />
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
          <Clock2 className="w-3.5 h-3.5 text-gray-400" />
          Methods:
          {reminder.notifications?.map((n: any, idx: number) => (
            <span key={idx} className="ml-[2px]">
              {capitalizeOnlyFirstLetter(n.method)}
              {idx < reminder.notifications.length - 1 ? "," : ""}
            </span>
          ))}
        </p>
        <p className="flex items-center gap-2 text-[13px] text-gray-500">
          <UserRoundCheck className="w-4 h-4 text-gray-400" />
          Send {filterType === "reminder" ? "Before" : "After"}:
          {reminder.reminderOffset?.map((offset: any, idx: number) => (
            <span key={idx} className="ml-1">
              {formatOffset(offset.sendOffset)}
              {idx < reminder.reminderOffset.length - 1 ? "," : ""}
            </span>
          ))}
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
              <Settings className="h-4 w-4" />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => console.log("clicked")}
              className="flex gap-2 items-center justify-start"
            >
              <Eye className="h-4 w-4 text-blue-400 " /> View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/reminders/edit/${reminder.id}`)}
              className="flex gap-2 items-center justify-start"
            >
              <FilePenLine className="h-4 w-4 text-green-600" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                deleteReminder(reminder)
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

export default ReminderCard
