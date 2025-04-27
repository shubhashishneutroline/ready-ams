"use client"

import React from "react"
import TableFilterTabs from "@/components/shared/table/table-filter-tabs"
import Table from "@/features/appointment/components/admin/table/table"
import TablePageHeader from "@/components/shared/table/table-page-header"
import { useRouter } from "next/navigation"

const AppointmentPage = () => {
  const router = useRouter()
  return (
    <div className="flex pr-10 md:pr-0 flex-col gap-y-3 md:gap-y-6 overflow-x-auto max-w-screen">
      <TableFilterTabs />
      <TablePageHeader
        title="Appointment"
        description="Manage and Customize Appointment Here."
        newButton="New Appointment"
        handleClick={() => {
          router.push("/appointment/create/")
        }}
      />
      <Table />
    </div>
  )
}

export default AppointmentPage
