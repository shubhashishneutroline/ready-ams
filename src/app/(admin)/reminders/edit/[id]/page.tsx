"use client"

import { Card } from "@/components/ui/card"
import PageTabs from "@/features/business-detail/components/page-tabs"
import { useState } from "react"
import { useParams } from "next/navigation"
import EditReminderForm from "@/components/custom-form-fields/reminder/edit-reminder-form"
import EditAnnouncementForm from "@/components/custom-form-fields/reminder/edit-announcement-form"
import {
  fetchReminderData,
  reminderData,
} from "@/features/reminder/action/action"
import { getReminder } from "@/features/reminder/api/api"
import ReminderForm from "@/components/custom-form-fields/reminder/reminder-form"

const ReminderPage = () => {
  const params = useParams()
  const id = params.id as string

  const isReminder = reminderData.some((s: any) => s.id === id)
  const finalType = isReminder ? "Reminder" : "Announcement || Offer"

  const [activeTab, setActiveTab] = useState(finalType)

  console.log(activeTab, "activeTab")
  return (
    <div>
      <Card className="h-full overflow-y-auto p-4 md:p-6">
        <PageTabs
          isReminder
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
        {activeTab === "Reminder" ? (
          <ReminderForm />
        ) : (
          <EditAnnouncementForm id={id} />
        )}
      </Card>
    </div>
  )
}

export default ReminderPage
