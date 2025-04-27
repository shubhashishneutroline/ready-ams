"use client"

import React from "react"
import Table from "@/features/customer/components/admin/table/table"
import TableFilterTabs from "@/features/customer/components/admin/table/table-filter-tabs"
import TablePageHeader from "@/components/shared/table/table-page-header"
import { useRouter } from "next/navigation"

const CustomerPage = () => {
  const router = useRouter()

  return (
    <div className="flex pr-10 md:pr-0 flex-col gap-y-3 md:gap-y-6 overflow-x-auto max-w-screen">
      <TableFilterTabs />
      <TablePageHeader
        title="Customer"
        description="Manage and Customize Customer Here."
        newButton="New Customer"
        handleClick={() => {
          router.push("/customer/create/")
        }}
      />
      <Table />
    </div>
  )
}

export default CustomerPage
