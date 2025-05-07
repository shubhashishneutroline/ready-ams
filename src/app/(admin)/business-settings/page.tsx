// "use client"
// import { useState } from "react"
// import Heading from "@/components/admin/heading"
// import { CalendarDays, Settings } from "lucide-react"
// import Breadcrumbs from "@/components/shared/bread-crumb"
// import PageTabs from "@/features/business-detail/components/page-tabs"
// import { Card } from "@/components/ui/card"
// import BusinessSettingsForm from "@/features/business-detail/components/business-avaialability-form"
// import BusinessDetailForm from "@/features/business-detail/components/business-detail-form"

// const BusinessPage = () => {
//   const [activeTab, setActiveTab] = useState("Business Detail")
//   const [businessData, setBusinessData] = useState()

//   return (
//     <main className="h-full flex flex-col">
//       <Breadcrumbs />
//       <div>
//         <Heading
//           title="Business Settings"
//           description="Manage and Customize your business"
//           icon={<Settings />}
//         />
//       </div>
//       <Card className="h-full overflow-x-hidden overflow-y-auto p-4 md:p-6">
//         <PageTabs
//           activeTab={activeTab}
//           onTabChange={(tab) => setActiveTab(tab)}
//         />
//         {activeTab === "Business Detail" ? (
//           <>
//             <BusinessDetailForm
//               setActiveTab={setActiveTab}
//               setBusinessData={setBusinessData}
//             />
//           </>
//         ) : (
//           <BusinessSettingsForm business={businessData} />
//         )}
//       </Card>
//     </main>
//   )
// }

// export default BusinessPage

// "use client"
// import { useState } from "react"
// import Heading from "@/components/admin/heading"
// import { Settings } from "lucide-react"
// import Breadcrumbs from "@/components/shared/bread-crumb"
// import PageTabs from "@/features/business-detail/components/page-tabs"
// import { Card } from "@/components/ui/card"
// import BusinessSettingsForm from "@/features/business-detail/components/business-avaialability-form"
// import BusinessDetailForm from "@/features/business-detail/components/business-detail-form"

// const BusinessPage = () => {
//   const [activeTab, setActiveTab] = useState("Business Detail")
//   const [businessData, setBusinessData] = useState<any>(null)

//   return (
//     <main className="h-full flex flex-col">
//       <Breadcrumbs />
//       <div>
//         <Heading
//           title="Business Settings"
//           description="Manage and Customize your business"
//           icon={<Settings />}
//         />
//       </div>
//       <Card className="h-full overflow-x-hidden overflow-y-auto p-4 md:p-6">
//         <PageTabs
//           activeTab={activeTab}
//           onTabChange={(tab) => setActiveTab(tab)}
//         />
//         {activeTab === "Business Detail" ? (
//           <BusinessDetailForm
//             setActiveTab={setActiveTab}
//             setBusinessData={setBusinessData}
//             businessData={businessData}
//           />
//         ) : (
//           <BusinessSettingsForm business={businessData} />
//         )}
//       </Card>
//     </main>
//   )
// }

// export default BusinessPage

"use client"
import { useState, useEffect } from "react"
import Heading from "@/components/admin/heading"
import { Settings } from "lucide-react"
import Breadcrumbs from "@/components/shared/bread-crumb"
import PageTabs from "@/features/business-detail/components/page-tabs"
import { Card } from "@/components/ui/card"
import BusinessSettingsForm from "@/features/business-detail/components/business-avaialability-form"
import BusinessDetailForm from "@/features/business-detail/components/business-detail-form"
import { toast } from "sonner"
import { useBusinessStore } from "./_store/business-store"

// Weekday mapping for form ↔ database conversion
const weekdayMap: { [key: string]: string } = {
  Mon: "MONDAY",
  MONDAY: "Mon",
  Tue: "TUESDAY",
  TUESDAY: "Tue",
  Wed: "WEDNESDAY",
  WEDNESDAY: "Wed",
  Thu: "THURSDAY",
  THURSDAY: "Thu",
  Fri: "FRIDAY",
  FRIDAY: "Fri",
  Sat: "SATURDAY",
  SATURDAY: "Sat",
  Sun: "SUNDAY",
  SUNDAY: "Sun",
}

const BusinessPage = () => {
  const [activeTab, setActiveTab] = useState("Business Detail")
  const [businessData, setBusinessData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { selectedBusiness, loading, error, fetchBusinessById } =
    useBusinessStore()

  useEffect(() => {
    const id = "cmadx1e7l006rmsw31ohrrj72"
    fetchBusinessById(id)
  }, [fetchBusinessById])

  useEffect(() => {
    if (selectedBusiness) {
      console.log("Selected business:", selectedBusiness)
      setBusinessData(transformBusinessDataForForms(selectedBusiness))
      setIsLoading(false)
      console.log("Business transformed data:", businessData)
    } else if (error) {
      toast.error("Failed to fetch business data: " + error)
      setIsLoading(false)
    }
  }, [selectedBusiness, error])

  // Utility function to transform DB data for form compatibility
  const transformBusinessDataForForms = (data: any) => {
    // Derive businessDays from businessAvailability
    const businessDays = data.businessAvailability
      .map((avail: any) => weekdayMap[avail.weekDay])
      .filter((day: string) =>
        ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].includes(day)
      )

    // Transform holidays
    const holidays = data.holiday.map((h: any) => weekdayMap[h.holiday])

    return {
      id: data.id,
      businessName: data.name,
      industry: data.industry,
      email: data.email,
      phone: data.phone,
      website: data.website || "",
      city: data.address[0]?.city || "",
      street: data.address[0]?.street || "",
      state: "",
      zipCode: data.address[0]?.zipCode || "",
      country: data.address[0]?.country || "",
      googleMap: data.address[0]?.googleMap || "",
      registrationNumber: data.businessRegistrationNumber,
      taxId: null,
      logo: null,
      visibility: data.status,
      timeZone: data.timeZone,
      businessDays:
        businessDays.length > 0
          ? businessDays
          : ["Mon", "Tue", "Wed", "Thu", "Fri"],
      holidays,
      businessHours: transformAvailabilityForForm(data.businessAvailability),
    }
  }

  // Transform availability data for BusinessSettingsForm
  const transformAvailabilityForForm = (availability: any[]) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const businessHours: any = {}

    // Initialize all days with empty work and break arrays
    days.forEach((day) => {
      businessHours[day] = { work: [], break: [] }
    })

    // Map availability to businessHours
    availability.forEach((avail) => {
      const dayKey = weekdayMap[avail.weekDay] // e.g., "MONDAY" -> "Mon"
      if (!dayKey || !businessHours[dayKey]) {
        console.warn(`Invalid dayKey for weekDay: ${avail.weekDay}`)
        return
      }
      avail.timeSlots.forEach((slot: any) => {
        const startTime = formatTo12Hour(slot.startTime)
        const endTime = formatTo12Hour(slot.endTime)
        const slotPair = [startTime, endTime]
        if (slot.type === "WORK") {
          businessHours[dayKey].work.push(slotPair)
        } else if (slot.type === "BREAK") {
          businessHours[dayKey].break.push(slotPair)
        }
      })
    })

    // Log specifically for Wednesday to debug break time issue
    console.log("Wednesday businessHours:", businessHours.Wed)
    console.log("Transformed businessHours:", businessHours)
    return businessHours
  }

  // Convert 24-hour time (HH:mm:ss) to 12-hour AM/PM
  const formatTo12Hour = (time: string) => {
    if (!time) {
      console.warn("Invalid time input:", time)
      return "00:00 AM"
    }
    const [hours, minutes] = time.split(":")
    const hourNum = parseInt(hours, 10)
    const period = hourNum >= 12 ? "PM" : "AM"
    const adjustedHour = hourNum % 12 || 12
    const formattedHour = adjustedHour.toString().padStart(2, "0")
    const formattedMinutes = minutes.slice(0, 2)
    return `${formattedHour}:${formattedMinutes} ${period}`
  }

  if (isLoading || loading) {
    return <div>Loading...</div>
  }

  return (
    <main className="h-full flex flex-col">
      <Breadcrumbs />
      <div>
        <Heading
          title="Business Settings"
          description="Manage and Customize your business"
          icon={<Settings />}
        />
      </div>
      <Card className="h-full overflow-x-hidden overflow-y-auto p-4 md:p-6">
        <PageTabs
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />
        {activeTab === "Business Detail" ? (
          <BusinessDetailForm
            setActiveTab={setActiveTab}
            setBusinessData={setBusinessData}
            businessData={businessData}
          />
        ) : (
          <BusinessSettingsForm business={businessData} />
        )}
      </Card>
    </main>
  )
}

export default BusinessPage
