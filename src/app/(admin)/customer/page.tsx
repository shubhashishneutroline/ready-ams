"use client"

import React, { useCallback, useEffect, useMemo } from "react"
import PageTabs from "@/components/table/page-tabs"
import TablePageHeader from "@/components/table/table-header"
import { columns } from "./_components/column"
import { DataTable } from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import DataTableSkeleton from "@/components/table/skeleton-table"
import { User } from "@/app/(admin)/customer/_types/customer"
import { useCustomerStore } from "./_store/customer-store"

const pageOptions = ["Active", "Inactive", "All"]
const REFETCH_INTERVAL = 5 * 60 * 1000 // 5 minutes

const CustomerPage = () => {
  const {
    activeTab,
    onActiveTab,
    customers,
    loading,
    isRefreshing,
    fetchCustomers,
    deleteCustomer,
    hasFetched,
    getFilteredCustomers,
  } = useCustomerStore()

  // Debug customers state
  console.log("customers from store:", customers)

  // Fetch data
  const fetchData = useCallback(
    async (isManualRefresh = false) => {
      await fetchCustomers(isManualRefresh)
    },
    [fetchCustomers]
  )

  // Handle delete
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteCustomer(id)
        // No need for toast, store handles it
        console.log(`Deleted customer with id: ${id}`)
      } catch (error) {
        console.error("Error deleting customer:", error)
        // Store handles toast
      }
    },
    [deleteCustomer]
  )

  // Memoized columns
  const memoizedColumns = useMemo(() => columns(handleDelete), [handleDelete])

  // Memoized filtered customers
  const filteredCustomers = useMemo(() => {
    const result = getFilteredCustomers()
    if (!Array.isArray(result)) {
      console.warn(
        "filteredCustomers: getFilteredCustomers did not return an array:",
        result
      )
      return []
    }
    console.log("filteredCustomers:", result) // Debug
    return result
  }, [customers, activeTab]) // Simplified dependencies

  // Initial fetch and periodic refetch
  useEffect(() => {
    fetchData()

    // Set up periodic refetch
    const interval = setInterval(() => {
      fetchData(true) // Silent refresh
    }, REFETCH_INTERVAL)

    return () => clearInterval(interval) // Cleanup on unmount
  }, [fetchData])

  // Manual refresh handler
  const handleRefresh = useCallback(() => {
    fetchData(true) // Show refresh indicator
  }, [fetchData])

  return (
    <div className="h-full w-full flex flex-col">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <PageTabs
            isReminder
            activeTab={activeTab}
            onTabChange={onActiveTab}
            customTabs={pageOptions}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        <TablePageHeader
          title="Customer"
          description="Manage and Customize Customer Here."
          newButton="New Customer"
          route="/customer/create/"
        />
        {loading && !hasFetched ? ( // Show skeleton only on initial load
          <DataTableSkeleton />
        ) : filteredCustomers.length === 0 && hasFetched ? ( // Show no data message only after fetch attempt
          <div className="text-center py-4 text-sm text-muted-foreground italic">
            No customers found for the selected tab
            {activeTab !== "All" ? ` ['${activeTab}']` : ""}. Try refreshing or
            adjusting tabs.
          </div>
        ) : (
          // Render table if data exists or if still loading initially (covered by first condition)
          <div className="relative overflow-x-auto">
            <DataTable
              columns={memoizedColumns}
              data={filteredCustomers} // This uses the reactively updated data
              searchFieldName="name"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerPage
