"use client"

import React, { useEffect, useState } from "react"
import TableFilterTabs from "@/components/shared/table/table-filter-tabs"
import TablePageHeader from "@/components/shared/table/table-page-header"
import { useRouter } from "next/navigation"
import { DataTable } from "@/features/help-support/components/data-table"
import { columns } from "@/features/appointment/components/admin/table/column"
import { getAppointments } from "@/features/appointment/api/api"
import dayjs from "dayjs"
import CustomerCard from "@/features/customer/components/admin/table/customer-cards"
import AppointmentCard from "@/features/appointment/components/admin/table/appointment-card"

const AppointmentPage = () => {
  const router = useRouter()
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [filterType, setFilterType] = useState("today")

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await getAppointments()
      setAppointments(data)
    }

    fetchAppointments()
  }, [])

  useEffect(() => {
    const today = dayjs().format("YYYY-MM-DD")

    const filtered = appointments.filter((appointment: any) => {
      const appointmentDate = dayjs(appointment.selectedDate).format(
        "YYYY-MM-DD"
      )

      switch (filterType) {
        case "today":
          return appointmentDate === today
        case "upcoming":
          return appointmentDate > today
        case "completed":
          return appointment.status === "COMPLETED"
        case "all":
        default:
          return true
      }
    })

    setFilteredAppointments(filtered)
  }, [appointments, filterType])

  return (
    <div className="flex  flex-col gap-y-3 md:gap-y-6 overflow-x-auto max-w-screen">
      <TableFilterTabs onChange={setFilterType} />
      <TablePageHeader
        title="Appointment"
        description="Manage and Customize Appointment Here."
        newButton="New Appointment"
        handleClick={() => {
          router.push("/appointment/create/")
        }}
      />
      <div className=" hidden md:block">
        <DataTable columns={columns} data={filteredAppointments} />
      </div>
      <div className="block md:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments?.map((appointment: any, index: number) => (
          <AppointmentCard key={index} appointment={appointment} />
        ))}
      </div>
    </div>
  )
}

export default AppointmentPage
