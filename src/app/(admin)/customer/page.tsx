"use client"

import React, { useEffect, useState } from "react"
import Table from "@/features/customer/components/admin/table/table"
import TableFilterTabs from "@/features/customer/components/admin/table/table-filter-tabs"
import TablePageHeader from "@/components/shared/table/table-page-header"
import { useRouter } from "next/navigation"
import { getCustomers } from "@/features/customer/api/api"
import { columns } from "@/features/customer/components/admin/table/column"
import { DataTable } from "@/features/customer/components/admin/table/data-table"
import CustomerCard from "@/features/customer/components/admin/table/customer-cards"

const CustomerPage = () => {
  const router = useRouter()
  const [customer, setCustomer] = useState([])
  const [filteredCustomer, setFilteredCustomer] = useState([])
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await getCustomers()
      setCustomer(data)
    }

    fetchAppointments()
  }, [])

  console.log(customer, "Customer Data fetched")

  useEffect(() => {
    const filtered = customer.filter((cust: any) => {
      console.log(cust.isActive, "hello")

      switch (filterType) {
        case "active":
          return cust.isActive === true
        case "inactive":
          return cust.isActive === false
        case "all":
        default:
          return true
      }
    })
    setFilteredCustomer(filtered)
  }, [customer, filterType])

  console.log(filteredCustomer, "filteredCustomer")

  return (
    <div className="flex flex-col gap-y-3 md:gap-y-6 overflow-x-auto max-w-screen">
      <TableFilterTabs onChange={setFilterType} />
      <TablePageHeader
        title="Customer"
        description="Manage and Customize Customer Here."
        newButton="New Customer"
        handleClick={() => {
          router.push("/customer/create/")
        }}
      />
      <div className="hidden md:block">
        <DataTable columns={columns} data={filteredCustomer} />
      </div>
      <div className="block md:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomer?.map((customer: any, index: number) => (
          <CustomerCard key={index} customer={customer} />
        ))}
      </div>
    </div>
  )
}

export default CustomerPage
