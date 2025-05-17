"use client"
import Breadcrumbs from "@/components/shared/bread-crumb"
import Heading from "@/components/admin/heading"
import { CalendarDays } from "lucide-react"
import { Card } from "@/components/ui/card"
import AnnouncementForm from "@/features/reminder/components/announcment/announcement-form"
import { useState } from "react"

import ReminderForm from "@/components/custom-form-fields/reminder/reminder-form"
import PageTabs from "@/components/table/page-tabs"
import { useNotificationStore } from "../_store/reminder-store"

const ReminderPage = () => {
  const { activeTab, onActiveTab } = useNotificationStore()
  console.log(activeTab, "activeTab")
  const isRemindetr =
    activeTab === "Reminder" || activeTab === "Announcement || Offer"

  return (
    <div className="h-full overflow-y-auto">
      {activeTab === "Reminder" ? <ReminderForm /> : <AnnouncementForm />}
    </div>
  )
}

export default ReminderPage
