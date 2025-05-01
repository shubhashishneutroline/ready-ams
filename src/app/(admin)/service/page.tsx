"use client"

import React, { useEffect, useState } from "react"
import TableFilterTabs from "@/features/service/components/admin/table/table-filter-tabs"
import TablePageHeader from "@/components/shared/table/table-page-header"
import { useRouter } from "next/navigation"
import { getServices } from "@/features/service/api/api"
import { columns } from "@/features/service/components/admin/table/column"
import { DataTable } from "@/features/service/components/admin/table/data-table"
import ServiceCard from "@/features/service/components/admin/table/service-card"

const ServicePage = () => {
  // fetch data in the server
  const router = useRouter()
  const [service, setService] = useState<any>([])
  const [filteredService, setFilteredService] = useState([])
  const [filterType, setFilterType] = useState("inactive")

  useEffect(() => {
    const fetchServices = async () => {
      const data = await getServices()
      if (Array.isArray(data)) {
        setService(data)
      } else {
        console.error("getServices() did not return an array:", data)
      }
    }

    fetchServices()
  }, [])

  useEffect(() => {
    console.log(service, "service inside useeffect")
    const filtered = service.filter((cust: any) => {
      switch (filterType) {
        case "active":
          return cust.status?.toUpperCase() === "ACTIVE"
        case "inactive":
          return cust.status?.toUpperCase() === "INACTIVE"
        case "all":
        default:
          return true
      }
    })

    setFilteredService(filtered)
  }, [service, filterType])

  return (
    <div className="flex flex-col gap-y-3 md:gap-y-6 overflow-x-auto max-w-screen">
      <TableFilterTabs onChange={setFilterType} />
      <TablePageHeader
        title="Services & Products"
        description="Manage and Customize Services Here."
        newButton="New Service"
        handleClick={() => {
          router.push("/service/create/")
        }}
      />
      <div className=" hidden md:block">
        <DataTable columns={columns} data={filteredService} />
      </div>
      <div className="block md:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredService?.map((service: any, index: number) => (
          <ServiceCard key={index} service={service} />
        ))}
      </div>
    </div>
  )
}

export default ServicePage
