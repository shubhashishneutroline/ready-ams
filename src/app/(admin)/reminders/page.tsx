"use client"
import ReminderTabsPage from "@/features/reminder/components/reminder/reminder-page"

import { getReminder } from "@/features/reminder/api/api"
import PageTabs from "@/components/table/page-tabs"
import { useReminderStore } from "./_store/reminder-store"
import { Announcement } from "@mui/icons-material"

const tabOptions = ["Reminder", "Announcement"]

const ReminderPage = () => {
  const { activeTab, onActiveTab } = useReminderStore()
  return (
    <>
      <PageTabs
        customTabs={tabOptions}
        activeTab={activeTab}
        onTabChange={onActiveTab}
      />
      {activeTab === "Reminder" && <ReminderTabsPage />}
      {/* {activeTab === "Announcement" && <AnnouncementPage />} */}
    </>
  )
}

export default ReminderPage
