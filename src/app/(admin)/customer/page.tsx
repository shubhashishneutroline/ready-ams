"use client"

import React, { useCallback, useEffect, useState } from "react"
import { deleteCustomer, getCustomers } from "@/features/customer/api/api"
import { useCustomerStore } from "@/state/store"
import { toast } from "sonner"
import PageTabs from "@/components/shared/page-tabs"
import TablePageHeader from "@/components/table/table-header"
import { columns } from "./_components/column"
import { User } from "@/features/customer/types/types"
import { DataTable } from "@/components/table/data-table"

const pageOptions = ["Active", "Inactive", "All"]

const CustomerPage = () => {
  const { activeTab, onActiveTab } = useCustomerStore()
  const [customers, setCustomers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  // fetch data: Customer
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getCustomers()
      const filteredData = response.filter((item: User) => {
        if (activeTab === "Active") {
          return item.isActive === true
        } else if (activeTab === "Inactive") {
          return item.isActive === false
        }
        return true // "All" tab
      })
      setCustomers(filteredData)
    } catch (error) {
      console.error("Error fetching customers:", error)
      toast.error("Failed to load customers")
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  const handleDelete = useCallback(
    async (id: string) => {
      console.log("Deleting appointment with ID:", id)

      try {
        const res = await deleteCustomer(id) // Use correct API
        if (res) {
          setCustomers((prevData) => prevData.filter((item) => item.id !== id))
          toast.success("Customer deleted successfully")
        } else {
          throw new Error("Deletion failed")
        }
      } catch (error) {
        console.error("Error deleting appointment:", error)
        toast.error("Failed to delete appointment")
      }
    },
    [customers] // Include data as a dependency
  )

  // Handle initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // return (
  //   <div className="flex flex-col gap-y-3 md:gap-y-6 overflow-x-auto max-w-screen">
  //     <TableFilterTabs onChange={setFilterType} />
  //     <TablePageHeader
  //       title="Customer"
  //       description="Manage and Customize Customer Here."
  //       newButton="New Customer"
  //       handleClick={() => {
  //         router.push("/customer/create/")
  //       }}
  //     />
  //     <div className="hidden md:block">
  //       <DataTable columns={columns} data={filteredCustomer} />
  //     </div>
  //     <div className="block md:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  //       {filteredCustomer?.map((customer: any, index: number) => (
  //         <CustomerCard key={index} customer={customer} />
  //       ))}
  //     </div>
  //   </div>
  // )
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
          title="Customer"
          description="Manage and Customize Customer Here."
          newButton="New Customer"
          route="/customer/create/"
        />
        {loading ? (
          <div className="flex justify-center items-center py-20 text-muted-foreground">
            Loading customers...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns(handleDelete)}
              data={customers}
              searchFieldName="name"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerPage
