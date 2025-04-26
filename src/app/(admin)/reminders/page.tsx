import { getAnnouncement } from "@/features/announcement-offer/api/api";

import ReminderTabsPage from "@/features/reminder/components/reminder/reminder-page";

import { getReminder } from "@/features/reminder/api/api";

const ReminderPage = async () => {
  const ReminderData = await getReminder();
  const AnnouncementData = await getAnnouncement();

  return (
    <main className="h-full flex flex-col">
      <ReminderTabsPage
        reminderData={ReminderData}
        announcementData={AnnouncementData}
      />
    </main>
  );
};

export default ReminderPage;
