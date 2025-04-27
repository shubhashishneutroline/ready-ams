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

const ReminderTabsPage = ({ reminderData, announcementData }: any) => {
  const [activeTab, setActiveTab] = useState("Reminder")
  const router = useRouter()

  return (
    <div>
      <Card className="h-full overflow-y-auto p-4 md:p-6">
        <PageTabs
          isReminder
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
        {/* {activeTab === "Reminder" ? <ReminderForm /> : <AnnouncementForm />} */}
        {activeTab === "Reminder" ? (
          <>
            <TableFilterTabs />
            <TablePageHeader
              title="Reminder"
              description="Manage and Customize your business"
              newButton="New Reminder"
              handleClick={() => {
                router.push("/reminders/create/")
              }}
            />
            <DataTable columns={reminderColumns} data={reminderData} />
          </>
        ) : (
          <>
            <TableFilterTabs />
            <TablePageHeader
              title="Announcement"
              description="Manage and Customize your business"
              newButton="New Announcement"
              handleClick={() => {
                router.push("/reminders/create/")
              }}
            />
            <DataTable columns={announcementColumns} data={announcementData} />
          </>
          // <AnnouncementForm />
        )}
      </Card>
    </div>
  )
}

export default ReminderTabsPage
