"use client"
import Breadcrumbs from "@/components/shared/bread-crumb"
import Heading from "@/components/admin/heading"
import { CalendarDays } from "lucide-react"
import { Card } from "@/components/ui/card"
import AnnouncementForm from "@/features/reminder/components/announcment/announcement-form"
import { useState } from "react"

import ReminderForm from "@/components/custom-form-fields/reminder/reminder-form"
import { useReminderStore } from "../_store/reminder-store"
import PageTabs from "@/components/table/page-tabs"

const ReminderPage = () => {
  const { activeTab, onActiveTab } = useReminderStore()
  console.log(activeTab, "activeTab")
  const isRemindetr =
    activeTab === "Reminder" || activeTab === "Announcement || Offer"

  return (
    <div>
      <Card className="h-full overflow-y-auto p-4 md:p-6">
        <PageTabs
          isReminder={isRemindetr}
          activeTab={activeTab}
          onTabChange={onActiveTab}
        />
        {activeTab === "Reminder" ? <ReminderForm /> : <AnnouncementForm />}
      </Card>
    </div>
  )
}

export default ReminderPage
