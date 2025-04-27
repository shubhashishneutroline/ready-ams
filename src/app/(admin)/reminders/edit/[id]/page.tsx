"use client"
import Breadcrumbs from "@/components/shared/bread-crumb"
import Heading from "@/components/admin/heading"
import { CalendarDays } from "lucide-react"
import { Card } from "@/components/ui/card"
import PageTabs from "@/features/business-detail/components/page-tabs"
import AnnouncementForm from "@/features/reminder/components/announcment/announcement-form"
import { useState } from "react"

import ReminderForm from "@/components/custom-form-fields/reminder/reminder-form"
import { useParams } from "next/navigation"
import { ReminderData } from "../../page"
import EditReminderForm from "@/components/custom-form-fields/reminder/edit-reminder-form"
import EditAnnouncementForm from "@/components/custom-form-fields/reminder/edit-announcement-form"

const ReminderPage = () => {
  const params = useParams()
  const id = params.id as string

  const isReminder = ReminderData.some((s: any) => s.id === id)
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
          <EditReminderForm id={id} />
        ) : (
          <EditAnnouncementForm id={id} />
        )}
      </Card>
    </div>
  )
}

export default ReminderPage
