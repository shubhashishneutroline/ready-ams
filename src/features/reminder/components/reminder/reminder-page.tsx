"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"

import PageTabs from "@/features/business-detail/components/page-tabs"

import TablePageHeader from "@/components/shared/table/table-page-header"
import { DataTable } from "./data-table"

import { getReminder } from "../../api/api"
import { getAnnouncement } from "@/features/announcement-offer/api/api"
import { reminderColumns } from "@/features/reminder/components/reminder/columns"
import { announcementColumns } from "../announcment/columns"
import dayjs from "dayjs"
import { AnnouncementOrOffer, Reminder } from "@/data/structure"
import TableFilterTabs from "./table-filter-tabs"
import TableFilterTabs1 from "../announcment/table-filter-tabs"
import { getAnnouncementStatus } from "../../lib/lib"
import ReminderCard from "./reminder-card"
import AnnouncementCard from "../announcment/announcement-card"

const ReminderTabsPage = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("Reminder")

  const [reminders, setReminders] = useState<Reminder[]>([])
  const [announcements, setAnnouncements] = useState<AnnouncementOrOffer[]>([])
  const [filterType, setFilterType] = useState("today")
  const [filterType1, setFilterType1] = useState("sent")

  const [filteredReminders, setFilteredReminders] = useState<Reminder[]>([])
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<
    AnnouncementOrOffer[]
  >([])

  const getExpiryDuration = (expiry: string): number => {
    switch (expiry) {
      case "ONE_DAY":
        return 1 * 24 * 60 * 60 * 1000
      case "THREE_DAYS":
        return 3 * 24 * 60 * 60 * 1000
      case "SEVEN_DAYS":
        return 7 * 24 * 60 * 60 * 1000
      default:
        return 0
    }
  }
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

    const filterReminders = (items: Reminder[]) =>
      items.filter((item) => {
        switch (filterType) {
          case "reminder":
            return item.type === "REMINDER"
          case "follow_up":
            return item.type === "FOLLOW_UP"
          case "cancellation":
            return item.type === "CANCELLATION"
          case "missed":
            return item.type === "MISSED"
          case "custom":
            return item.type === "CUSTOM"
          default:
            return true
        }
      })

    const filterAnnouncements = (items: AnnouncementOrOffer[]) =>
      items.filter((item) => {
        const now = new Date().getTime()
        const scheduledTime = new Date(item.scheduledAt).getTime()
        const expiryDuration = getExpiryDuration(item.expiredAt)
        const expiryTime = scheduledTime + expiryDuration

        switch (filterType1) {
          case "sent":
            return scheduledTime <= now && now <= expiryTime
          case "scheduled":
            return scheduledTime > now
          case "expired":
            return now > expiryTime
          case "all":
          default:
            return true
        }
      })

    setFilteredReminders(filterReminders(reminders))
    setFilteredAnnouncements(filterAnnouncements(announcements))
  }, [reminders, announcements, filterType, filterType1])

  return (
    <div className="flex flex-col gap-y-3 md:gap-y-6 overflow-x-auto max-w-screen">
      <Card className="w-full p-4">
        <PageTabs
          isReminder
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />

        {activeTab === "Reminder" ? (
          <TableFilterTabs onChange={setFilterType} />
        ) : (
          <TableFilterTabs1 onChange={setFilterType1} />
        )}

        {activeTab === "Reminder" ? (
          <div className="flex flex-col ">
            <div className="hidden md:block space-y-3 md:space-y-6">
              <TablePageHeader
                title="Reminder"
                description="Manage and Customize your business"
                newButton="New Reminder"
                handleClick={() => {
                  router.push("/reminders/create/")
                }}
              />
              <DataTable columns={reminderColumns} data={filteredReminders} />
            </div>
            <div className="block md:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReminders?.map((reminder: any, index: number) => (
                <ReminderCard
                  key={index}
                  reminder={reminder}
                  filterType={filterType}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="hidden md:block space-y-3 md:space-y-6">
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
            </div>
            <div className="block md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredAnnouncements?.map((reminder: any, index: number) => (
                <AnnouncementCard key={index} announcement={reminder} />
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default ReminderTabsPage
