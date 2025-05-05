"use client"

import { useEffect, useMemo, useCallback, useRef } from "react"
import { useAppointmentStore } from "./_store/appointment-store"
import { columns } from "./_components/column"
import { DataTable } from "@/components/table/data-table"
import PageTabs from "@/components/table/page-tabs"
import TablePageHeader from "@/components/table/table-header"
import DataTableSkeleton from "@/components/table/skeleton-table"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { cn } from "@/utils/utils"

const pageOptions = [
  "Today",
  "Upcoming",
  "Completed",
  "Cancelled",
  "Missed",
  "All",
]

// Keep enum if needed elsewhere, but store handles status mapping internally
// export enum AppointmentStatus { ... }

const AppointmentPage = () => {
  const {
    activeTab,
    onActiveTab,
    getFilteredAppointments,
    deleteAppointment,
    fetchAppointments,
    appointments, // This will now update reactively
    loading,
    isRefreshing,
    hasFetched,
    error,
  } = useAppointmentStore()

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // Initial fetch only if not fetched
  useEffect(() => {
    // Fetch only if not already loading/refreshing AND data hasn't been fetched yet.
    if (!loading && !isRefreshing && !hasFetched) {
      console.log("Initial fetch triggered: no data fetched or not loading.")
      fetchAppointments()
    }
    // Intentionally limited dependencies: Only run on mount essentially,
    // or if these specific flags change in a way that indicates a need for initial fetch.
  }, [loading, isRefreshing, hasFetched, fetchAppointments])

  // *** REMOVE THIS EFFECT ***
  // It's inefficient and unnecessary now that the store handles updates
  /*
  useEffect(() => {
    fetchAppointments() // DON'T REFETCH ALL DATA HERE
    console.log("Appointments updated/created", appointments)
  }, [appointments, fetchAppointments])
  */

  // Handle error toasts (Keep this)
  useEffect(() => {
    if (error) {
      console.log("Error state:", error)
      // Debounce or ensure toast doesn't appear repeatedly if error state persists
      // toast.error(error); // Store methods likely already toasted errors
    }
  }, [error])

  // Auto-refresh every 5 minutes (Keep this)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Silent auto-refresh triggered")
      fetchAppointments(false) // Silent refresh
    }, 300000) // 5 minutes

    return () => clearInterval(interval)
  }, [fetchAppointments])

  // Delete handler (Keep this - uses store method correctly)
  const handleDelete = useCallback(
    async (id: string) => {
      await deleteAppointment(id)
    },
    [deleteAppointment]
  )

  // Manual refresh handler (Keep this)
  const handleRefresh = useCallback(() => {
    if (debounceTimeout.current) {
      return
    }
    console.log("Manual refresh triggered")
    debounceTimeout.current = setTimeout(() => {
      fetchAppointments(true)
      debounceTimeout.current = null
    }, 300)
  }, [fetchAppointments])

  // Cleanup debounce on unmount (Keep this)
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [])

  // Filtered appointments will re-compute automatically when `appointments` state changes
  const filteredAppointments = useMemo(() => {
    const result = getFilteredAppointments()
    console.log("Rendered filtered appointments:", result)
    return result
    // Depend on activeTab and the appointments array from the store
  }, [activeTab, appointments, getFilteredAppointments]) // Added getFilteredAppointments dependency

  // Memoized columns (Keep this)
  const memoizedColumns = useMemo(() => columns(handleDelete), [handleDelete])

  // --- (Keep the JSX return structure the same) ---
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
          title="Appointment"
          description="Manage and Customize Appointment Here."
          newButton="New Appointment"
          route="/appointment/create/" // Ensure this route matches your form's location
        />
        {/* Loading/Empty/Data states */}
        {loading && !hasFetched ? ( // Show skeleton only on initial load
          <DataTableSkeleton />
        ) : filteredAppointments.length === 0 && hasFetched ? ( // Show no data message only after fetch attempt
          <div className="text-center py-4 text-sm text-muted-foreground italic">
            No appointments found for the selected tab
            {activeTab !== "All" ? ` ['${activeTab}']` : ""}. Try refreshing or
            adjusting tabs.
          </div>
        ) : (
          // Render table if data exists or if still loading initially (covered by first condition)
          <div className="relative overflow-x-auto">
            <DataTable
              columns={memoizedColumns}
              data={filteredAppointments} // This uses the reactively updated data
              searchFieldName="customerName"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentPage
