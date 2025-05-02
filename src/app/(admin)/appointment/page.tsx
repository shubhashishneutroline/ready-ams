// app/(admin)/appointments/page.tsx
"use client"

import { useEffect, useState, useCallback } from "react"
import { useAppointmentStore } from "@/state/store"
import { columns } from "./_components/column"
import { getAppointments } from "./_action/appoinement"
import { DataTable } from "@/components/table/data-table"
import PageTabs from "@/components/shared/page-tabs"
import TablePageHeader from "@/components/table/table-header"
import { Appointment } from "@prisma/client"
import { isSameDay } from "date-fns"
import { toast } from "sonner"
import { deleteAppointment } from "@/features/appointment/api/api" // Correct import

const pageOptions = [
  "Today",
  "Upcoming",
  "Completed",
  "Cancelled",
  "Missed",
  "All",
]

export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  MISSED = "MISSED",
  CANCELLED = "CANCELLED",
  FOLLOW_UP = "FOLLOW_UP",
}

const AppointmentPage = () => {
  const { activeTab, onActiveTab } = useAppointmentStore()
  const [data, setData] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getAppointments()
      const filteredData = response.filter((item: Appointment) => {
        if (activeTab === "Today") {
          return isSameDay(new Date(item.selectedDate), new Date())
        } else if (activeTab === "Upcoming") {
          return item.status === AppointmentStatus.SCHEDULED
        } else if (activeTab === "Completed") {
          return item.status === AppointmentStatus.COMPLETED
        } else if (activeTab === "Missed") {
          return item.status === AppointmentStatus.MISSED
        } else if (activeTab === "Cancelled") {
          return item.status === AppointmentStatus.CANCELLED
        }
        return true // "All" tab
      })
      setData(filteredData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load appointments")
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  const handleDelete = useCallback(
    async (id: string) => {
      console.log("Deleting appointment with ID:", id)

      try {
        const res = await deleteAppointment(id) // Use correct API
        if (res) {
          setData((prevData) => prevData.filter((item) => item.id !== id))
          toast.success("Appointment deleted successfully")
        } else {
          throw new Error("Deletion failed")
        }
      } catch (error) {
        console.error("Error deleting appointment:", error)
        toast.error("Failed to delete appointment")
      }
    },
    [data] // Include data as a dependency
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="h-full w-full flex flex-col">
      <div className="space-y-4">
        <PageTabs
          isReminder
          activeTab={activeTab}
          onTabChange={onActiveTab}
          customTabs={pageOptions}
        />
        <TablePageHeader
          title="Appointment"
          description="Manage and Customize Appointment Here."
          newButton="New Appointment"
          route="/appointment/create/"
        />
        {loading ? (
          <div className="flex justify-center items-center py-20 text-muted-foreground">
            Loading appointments...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable columns={columns(handleDelete)} data={data} />
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentPage
