import { getAnnouncement } from "@/features/announcement-offer/api/api"

import ReminderTabsPage from "@/features/reminder/components/reminder/reminder-page"

import { getReminder } from "@/features/reminder/api/api"

export const ReminderData = await getReminder()
export const AnnouncementData = await getAnnouncement()

const ReminderPage = async () => {
  return (
    <ReminderTabsPage
      reminderData={ReminderData}
      announcementData={AnnouncementData}
    />
  )
}

export default ReminderPage
