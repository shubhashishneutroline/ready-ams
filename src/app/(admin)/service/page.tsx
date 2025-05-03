"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { getServices, deleteService, Service } from "@/features/service/api/api"
import PageTabs from "@/components/shared/page-tabs"
import TablePageHeader from "@/components/table/table-header"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useServiceStore } from "@/state/store"
import { columns } from "./_components/column"
import DataTableSkeleton from "@/components/table/skeleton-table"
import { DataTable } from "@/components/table/data-table"

const pageOptions = ["Active", "Inactive", "All"]

const ServicePage = () => {
  const { activeTab, onActiveTab } = useServiceStore()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch services
  const fetchServices = useCallback(
    async (isManualRefresh = false) => {
      try {
        if (isManualRefresh) setIsRefreshing(true)
        else setLoading(true)
        const data = await getServices()
        if (Array.isArray(data)) {
          setServices(data)
        } else {
          throw new Error("Invalid service data: expected an array")
        }
      } catch (error) {
        console.error("Error fetching services:", error)
        toast.error("Failed to load services")
      } finally {
        if (isManualRefresh) setIsRefreshing(false)
        else setLoading(false)
      }
    },
    [setServices]
  )

  // Handle delete
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const res = await deleteService(id)
        if (res) {
          setServices((prev) => prev.filter((item) => item.id !== id))
          toast.success("Service deleted successfully")
        } else {
          throw new Error("Deletion failed")
        }
      } catch (error) {
        console.error("Error deleting service:", error)
        toast.error("Failed to delete service")
      }
    },
    [setServices]
  )

  // Manual refresh handler
  const handleRefresh = useCallback(() => {
    fetchServices(true) // Show refresh indicator
  }, [fetchServices])

  // Initial fetch
  useEffect(() => {
    if (services.length === 0) {
      fetchServices()
    } else {
      setLoading(false) // Use cached services
    }
  }, [fetchServices, services])

  // Filter services based on activeTab
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      switch (activeTab.toLowerCase()) {
        case "active":
          return service.status?.toUpperCase() === "ACTIVE"
        case "inactive":
          return service.status?.toUpperCase() === "INACTIVE"
        case "all":
        default:
          return true
      }
    })
  }, [services, activeTab])

  // Memoized columns
  const memoizedColumns = useMemo(() => columns(handleDelete), [handleDelete])

  return (
    <div className="h-full w-full flex flex-col">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <PageTabs
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
          title="Services"
          description="Manage and Customize Services Here."
          newButton="New Service"
          route="/service/create/"
        />
        {loading ? (
          <DataTableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={memoizedColumns}
              data={filteredServices}
              searchFieldName="title"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ServicePage
