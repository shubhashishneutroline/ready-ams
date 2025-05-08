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
  const [isLoading, setIsLoading] = useState(false)
  const { selectedBusiness, loading, error } = useBusinessStore()

  useEffect(() => {
    if (selectedBusiness) {
      console.log("Selected business:", selectedBusiness)
      setBusinessData(transformBusinessDataForForms(selectedBusiness))
      setIsLoading(false)
      console.log("Business transformed data:", businessData)
    } else if (error) {
      toast.error("Failed to fetch business data: " + error)
      // setIsSubmitting(false)
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
      businessAvailability: data.businessAvailability, // Pass raw availability
    }
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
