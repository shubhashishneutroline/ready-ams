"use client"
import Breadcrumbs from "@/components/shared/bread-crumb"
import Heading from "@/components/admin/heading"
import { BadgePercent, CalendarDays } from "lucide-react"
import { Card } from "@/components/ui/card"
import PageTabs from "@/features/business-detail/components/page-tabs"
import { useState } from "react"

import { reminderColumns } from "@/features/reminder/components/reminder/columns"
import TableFilterTabs from "@/components/shared/table/table-filter-tabs"
import TablePageHeader from "@/components/shared/table/table-page-header"
import { useRouter } from "next/navigation"
import { announcementColumns } from "../announcment/columns"
import { DataTable } from "./data-table"
import { getReminder } from "../../api/api"
import { getAnnouncement } from "@/features/announcement-offer/api/api"

export const ReminderData = await getReminder()
export const AnnouncementData = await getAnnouncement()

const ReminderTabsPage = () => {
  const [activeTab, setActiveTab] = useState("Reminder")
  const router = useRouter()

  return (
    <div className="max-w-screen">
      <Card className="h-full p-2 w-full">
        <PageTabs
          isReminder
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
        {/* {activeTab === "Reminder" ? <ReminderForm /> : <AnnouncementForm />} */}
        {activeTab === "Reminder" ? (
          <div className="flex pr-8 sm:pr-10 xl:pr-0 flex-col gap-y-3 md:gap-y-6 overflow-x-auto max-w-screen">
            <TableFilterTabs />
            <TablePageHeader
              title="Reminder"
              description="Manage and Customize your business"
              newButton="New Reminder"
              handleClick={() => {
                router.push("/reminders/create/")
              }}
            />
            <DataTable columns={reminderColumns} data={ReminderData} />
          </div>
        ) : (
          <div className="flex pr-8 sm:pr-10  xl:pr-0 flex-col gap-y-3 md:gap-y-6 overflow-x-auto max-w-screen">
            <TableFilterTabs />
            <TablePageHeader
              title="Announcement"
              description="Manage and Customize your business"
              newButton="New Announcement"
              handleClick={() => {
                router.push("/reminders/create/")
              }}
            />
            <DataTable columns={announcementColumns} data={AnnouncementData} />
          </div>
          // <AnnouncementForm />
        )}
      </Card>
    </div>
  )
}

export default ReminderTabsPage
