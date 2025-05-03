// "use client"

// import React, { useCallback, useEffect, useState, useMemo } from "react"
// import { deleteCustomer, getCustomers } from "@/features/customer/api/api"
// import { useCustomerStore } from "@/state/store"
// import { toast } from "sonner"
// import PageTabs from "@/components/shared/page-tabs"
// import TablePageHeader from "@/components/table/table-header"
// import { columns } from "./_components/column"
// import { User } from "@/features/customer/types/types"
// import { DataTable } from "@/components/table/data-table"

// const pageOptions = ["Active", "Inactive", "All"]

// const CustomerPage = () => {
//   const { activeTab, onActiveTab } = useCustomerStore()
//   const [allCustomers, setAllCustomers] = useState<User[]>([])
//   const [loading, setLoading] = useState(true)

//   // Fetch data once on mount
//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true)
//       const response = await getCustomers()
//       setAllCustomers(response)
//     } catch (error) {
//       console.error("Error fetching customers:", error)
//       toast.error("Failed to load customers")
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   // Handle delete
//   const handleDelete = useCallback(async (id: string) => {
//     try {
//       const res = await deleteCustomer(id)
//       if (res) {
//         setAllCustomers((prev) => prev.filter((item) => item.id !== id))
//         toast.success("Customer deleted successfully")
//       } else {
//         throw new Error("Deletion failed")
//       }
//     } catch (error) {
//       console.error("Error deleting customer:", error)
//       toast.error("Failed to delete customer")
//     }
//   }, [])

//   // Memoized columns to prevent recreation
//   const memoizedColumns = useMemo(() => columns(handleDelete), [handleDelete])

//   // Filter customers based on activeTab
//   const filteredCustomers = useMemo(() => {
//     return allCustomers.filter((item: User) => {
//       if (activeTab === "Active") {
//         return item.isActive === true
//       } else if (activeTab === "Inactive") {
//         return item.isActive === false
//       }
//       return true // "All" tab
//     })
//   }, [allCustomers, activeTab])

//   // Initial data fetch
//   useEffect(() => {
//     fetchData()
//   }, [fetchData])

//   return (
//     <div className="h-full w-full flex flex-col">
//       <div className="space-y-4">
//         <PageTabs
//           isReminder
//           activeTab={activeTab}
//           onTabChange={onActiveTab}
//           customTabs={pageOptions}
//         />
//         <TablePageHeader
//           title="Customer"
//           description="Manage and Customize Customer Here."
//           newButton="New Customer"
//           route="/customer/create/"
//         />
//         {loading ? (
//           <div className="flex justify-center items-center py-20 text-muted-foreground">
//             Loading customers...
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <DataTable
//               columns={memoizedColumns}
//               data={filteredCustomers}
//               searchFieldName="name"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default CustomerPage

// ------ to get the fresh data ------
"use client"

import React, { useCallback, useEffect, useState, useMemo } from "react"
import { deleteCustomer, getCustomers } from "@/features/customer/api/api"
import { useCustomerStore } from "@/state/store"
import { toast } from "sonner"
import PageTabs from "@/components/shared/page-tabs"
import TablePageHeader from "@/components/table/table-header"
import { columns } from "./_components/column"
import { User } from "@/features/customer/types/types"
import { DataTable } from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import DataTableSkeleton from "@/components/table/skeleton-table"

const pageOptions = ["Active", "Inactive", "All"]
const REFETCH_INTERVAL = 5 * 60 * 1000 // 5 minutes

const CustomerPage = () => {
  const { activeTab, onActiveTab } = useCustomerStore()
  const [allCustomers, setAllCustomers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch data
  const fetchData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setIsRefreshing(true)
      else setLoading(true)
      const response = await getCustomers()
      setAllCustomers(response)
    } catch (error) {
      console.error("Error fetching customers:", error)
      toast.error("Failed to load customers")
    } finally {
      if (isManualRefresh) setIsRefreshing(false)
      else setLoading(false)
    }
  }, [])

  // Handle delete
  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await deleteCustomer(id)
      if (res) {
        setAllCustomers((prev) => prev.filter((item) => item.id !== id))
        toast.success("Customer deleted successfully")
      } else {
        throw new Error("Deletion failed")
      }
    } catch (error) {
      console.error("Error deleting customer:", error)
      toast.error("Failed to delete customer")
    }
  }, [])

  // Memoized columns
  const memoizedColumns = useMemo(() => columns(handleDelete), [handleDelete])

  // Filter customers based on activeTab
  const filteredCustomers = useMemo(() => {
    return allCustomers.filter((item: User) => {
      if (activeTab === "Active") {
        return item.isActive === true
      } else if (activeTab === "Inactive") {
        return item.isActive === false
      }
      return true // "All" tab
    })
  }, [allCustomers, activeTab])

  // Initial fetch and periodic refetch
  useEffect(() => {
    fetchData()

    // Set up periodic refetch
    const interval = setInterval(() => {
      fetchData(true) // Silent refresh (no loading UI)
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
        {loading ? (
          <DataTableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={memoizedColumns}
              data={filteredCustomers}
              searchFieldName="name"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerPage
