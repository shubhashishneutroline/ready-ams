"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"

import PageTabs from "@/features/business-detail/components/page-tabs"
import TableFilterTabs from "@/components/shared/table/table-filter-tabs"
import TablePageHeader from "@/components/shared/table/table-page-header"
import { DataTable } from "./data-table"

import { getReminder } from "../../api/api"
import { getAnnouncement } from "@/features/announcement-offer/api/api"
import { reminderColumns } from "@/features/reminder/components/reminder/columns"
import { announcementColumns } from "../announcment/columns"
import dayjs from "dayjs"
import { AnnouncementOrOffer, Reminder } from "@/data/structure"

const ReminderTabsPage = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("Reminder")

  const [reminders, setReminders] = useState<Reminder[]>([])
  const [announcements, setAnnouncements] = useState<AnnouncementOrOffer[]>([])
  const [filterType, setFilterType] = useState("today")

  const [filteredReminders, setFilteredReminders] = useState<Reminder[]>([])
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<
    AnnouncementOrOffer[]
  >([])

  useEffect(() => {
    const fetchData = async () => {
      const reminderData = await getReminder()
      const announcementData = await getAnnouncement()
      setReminders(reminderData)
      setAnnouncements(announcementData)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const today = dayjs().startOf("day")

    const filterData = (items: any[]) =>
      items.filter((item) => {
        const itemDate = dayjs(item.selectedDate).startOf("day")

        switch (filterType) {
          case "today":
            return itemDate.isSame(today)
          case "upcoming":
            return itemDate.isAfter(today)
          case "completed":
            return item.status === "COMPLETED"
          default:
            return true
        }
      })

    setFilteredReminders(filterData(reminders))
    setFilteredAnnouncements(filterData(announcements))
  }, [reminders, announcements, filterType])

  return (
    <div className="flex pr-10 md:pr-0 flex-col gap-y-3 md:gap-y-6 overflow-x-auto max-w-screen">
      <Card className="h-full w-full p-4">
        <PageTabs
          isReminder
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />

        <TableFilterTabs onChange={setFilterType} />

        {activeTab === "Reminder" ? (
          <>
            <TablePageHeader
              title="Reminder"
              description="Manage and Customize your business"
              newButton="New Reminder"
              handleClick={() => {
                router.push("/reminders/create/")
              }}
            />
            <DataTable columns={reminderColumns} data={filteredReminders} />
          </>
        ) : (
          <>
            <TablePageHeader
              title="Announcement"
              description="Manage and Customize your business"
              newButton="New Announcement"
              handleClick={() => {
                router.push("/announcements/create/")
              }}
            />
            <DataTable
              columns={announcementColumns}
              data={filteredAnnouncements}
            />
          </>
        )}
      </Card>
    </div>
  )
}

export default ReminderTabsPage
