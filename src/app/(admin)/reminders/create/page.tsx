"use client"
import Breadcrumbs from "@/components/shared/bread-crumb"
import Heading from "@/components/admin/heading"
import { CalendarDays } from "lucide-react"
import { Card } from "@/components/ui/card"
import PageTabs from "@/features/business-detail/components/page-tabs"
import AnnouncementForm from "@/features/reminder/components/announcment/announcement-form"
import { useState } from "react"

import ReminderForm from "@/components/custom-form-fields/reminder/reminder-form"

const ReminderPage = () => {
  const [activeTab, setActiveTab] = useState("Reminder")

  return (
    <div>
      <Card className="h-full overflow-y-auto p-4 md:p-6">
        <PageTabs
          isReminder
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
        {activeTab === "Reminder" ? <ReminderForm /> : <AnnouncementForm />}
      </Card>
    </div>
  )
}

export default ReminderPage
