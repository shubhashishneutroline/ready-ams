// // store/supportTabsStore.ts
// import { SupportBusinessDetail } from "@prisma/client"
// import { create } from "zustand"
// import { getSupportDetailByBusinessId } from "../_api-call/support-api-call"
// import { useBusinessStore } from "../../business-settings/_store/business-store"
// import { PostSupportBusinessDetail } from "../_types/types"

// // Define the valid mobile tab names as a TypeScript type
// // Ensures only specific keys ("Contact", "FAQs", "Issues", "Support") are used
// export type TabMapKey = "Contact" | "FAQs" | "Issues" | "Support"

// // Define the store's state and actions
// interface SupportTabsState {
//   // Current active tab (uses desktop tab names, e.g., "Contact Information")
//   activeTab: string
//   // Object mapping mobile tab names to desktop tab names
//   tabMap: Record<TabMapKey, string>
//   // Array of desktop tab names
//   tabs: string[]
//   // Array of mobile tab names
//   mTabs: TabMapKey[]
//   // Function to update activeTab (used for desktop tabs)
//   setActiveTab: (tab: string) => void
//   // Function to handle mobile tab changes (converts mobile to desktop tab name)
//   handleMobileTabChange: (mobileTab: TabMapKey) => void

//   // get support business details
//   getSupportBusinessDetails: () => Promise<void>
//   // get support business by Id
//   getSupportBusinessDetailById: (businessId: string) => Promise<any>
// }

// // Create the Zustand store
// export const useSupportTabsStore = create<SupportTabsState>((set) => ({
//   // Initial active tab
//   activeTab: "Contact Information",

//   // Mapping of mobile to desktop tab names
//   tabMap: {
//     Contact: "Contact Information",
//     FAQs: "Frequently Asked Questions (FAQs)",
//     Issues: "Customer Support",
//     Support: "Admin Support",
//   },

//   // Desktop tab names
//   tabs: [
//     "Contact Information",
//     "Frequently Asked Questions (FAQs)",
//     "Customer Support",
//     "Admin Support",
//   ],

//   // Mobile tab names
//   mTabs: ["Contact", "FAQs", "Issues", "Support"],

//   // Function to set activeTab (used for desktop tabs)
//   setActiveTab: (tab) => set({ activeTab: tab }),

//   // Function to handle mobile tab clicks
//   // Converts mobile tab name (e.g., "Contact") to desktop tab name (e.g., "Contact Information")
//   handleMobileTabChange: (mobileTab) =>
//     set((state) => {
//       const mapped = state.tabMap[mobileTab] // Get desktop tab name
//       return { activeTab: mapped || state.activeTab } // Update if valid, else keep current
//     }),

//   // Get support business details
//   getSupportBusinessDetails: async () => {},

//   // Get support business by Id
//   getSupportBusinessDetailById: async (businessId: string) => {
//     try {
//       const res = await getSupportDetailByBusinessId(businessId)
//       console.log(res, "inside Business details, store")

//       //   set({ supportBusinessDetail: transformBusinessDataForSupport(res) })
//       return { data: res, success: true }
//     } catch (error) {
//       console.error("Error fetching business:", error)
//       return { error, success: false, message: "Failed to fetch business" }
//     }
//   },
// }))

// // Transform business data from useBusinessStore to SupportBusinessDetail format
// // features/support-detail/action/action.ts

// // Weekday mapping to match database convention
// const weekdayMap: { [key: string]: string } = {
//   Mon: "MONDAY",
//   Tue: "TUESDAY",
//   Wed: "WEDNESDAY",
//   Thu: "THURSDAY",
//   Fri: "FRIDAY",
//   Sat: "SATURDAY",
//   Sun: "SUNDAY",
// }

// // Transform form data to SupportBusinessDetail format
// export const transformFormDataForSupportDetail = (
//   formData: any
// ): PostSupportBusinessDetail => {
//   const {
//     businessName,
//     supportEmail,
//     phone,
//     address,
//     googleMap,
//     businessHours,
//     businessDays,
//     holidays,
//     businessId,
//   } = formData

//   // Transform businessHours to supportAvailability
//   const supportAvailability = businessDays.map((day: string) => {
//     const hours = businessHours[day] || { work: [], break: [] }
//     const timeSlots = [
//       ...hours.work.map(([startTime, endTime]: [string, string]) => ({
//         type: "WORK" as const,
//         startTime,
//         endTime,
//       })),
//       ...hours.break.map(([startTime, endTime]: [string, string]) => ({
//         type: "BREAK" as const,
//         startTime,
//         endTime,
//       })),
//     ]

//     return {
//       weekDay: weekdayMap[day] || day,
//       type: "SUPPORT" as const,
//       timeSlots,
//     }
//   })

//   // Transform holidays to supportHoliday
//   const supportHoliday = holidays.map((day: string) => ({
//     holiday: weekdayMap[day] || day,
//     type: "SUPPORT" as const,
//     date: "",
//   }))

//   // Return transformed data
//   return {
//     supportBusinessName: businessName,
//     supportEmail,
//     supportPhone: phone,
//     supportAddress: address,
//     supportGoogleMap: googleMap,
//     supportAvailability,
//     supportHoliday,
//     businessId,
//   }
// }

// app/(admin)/support/_store/support-store.ts
import { create } from "zustand"
import { toast } from "sonner"
import { getSupportDetailByBusinessId } from "../_api-call/support-api-call"
import { PostSupportBusinessDetail } from "../_types/types"

// Define valid mobile tab names
export type TabMapKey = "Contact" | "FAQs" | "Issues" | "Support"

interface SupportBusinessDetail {
  id?: string
  supportBusinessName: string
  supportEmail: string
  supportPhone: string
  supportAddress: string
  supportGoogleMap: string
  supportAvailability: Array<{
    weekDay: string
    type: "SUPPORT"
    timeSlots: Array<{
      type: "WORK" | "BREAK"
      startTime: string
      endTime: string
    }>
  }>
  supportHoliday: Array<{
    holiday: string
    type: "SUPPORT"
    date: string
  }>
  businessId: string
}

interface SupportTabsState {
  activeTab: string
  tabMap: Record<TabMapKey, string>
  tabs: string[]
  mTabs: TabMapKey[]
  setActiveTab: (tab: string) => void
  handleMobileTabChange: (mobileTab: TabMapKey) => void
  supportDetail: SupportBusinessDetail | null
  loading: boolean
  error: string | null
  setSupportDetail: (detail: SupportBusinessDetail | null) => void
  getSupportBusinessDetailById: (businessId: string) => Promise<any>
}

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

// Transform SupportBusinessDetail to form data
export const transformSupportDetailForForm = (
  supportDetail: SupportBusinessDetail
) => {
  const businessHours: any = {}
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  days.forEach((day) => {
    businessHours[day] = { work: [], break: [] }
  })

  supportDetail.supportAvailability.forEach((avail) => {
    const dayKey = weekdayMap[avail.weekDay]
    if (!dayKey) return
    const workSlots: [string, string][] = []
    const breakSlots: [string, string][] = []
    avail.timeSlots.forEach((slot) => {
      const slotPair: [string, string] = [slot.startTime, slot.endTime]
      if (slot.type === "WORK") {
        workSlots.push(slotPair)
      } else if (slot.type === "BREAK") {
        breakSlots.push(slotPair)
      }
    })
    businessHours[dayKey].work = workSlots
    businessHours[dayKey].break = breakSlots
  })

  return {
    businessName: supportDetail.supportBusinessName,
    supportEmail: supportDetail.supportEmail,
    phone: supportDetail.supportPhone,
    address: supportDetail.supportAddress,
    googleMap: supportDetail.supportGoogleMap,
    businessHours,
    businessDays: supportDetail.supportAvailability.map(
      (avail) => weekdayMap[avail.weekDay]
    ),
    holidays: supportDetail.supportHoliday.map((h) => weekdayMap[h.holiday]),
  }
}

// Transform Business to form data
export const transformBusinessDataForSupportDetail = (business: any) => {
  const businessHours: any = {}
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  days.forEach((day) => {
    businessHours[day] = { work: [], break: [] }
  })

  business.businessAvailability.forEach((avail: any) => {
    const dayKey = weekdayMap[avail.weekDay]
    if (!dayKey) return
    const workSlots: [string, string][] = []
    const breakSlots: [string, string][] = []
    avail.timeSlots.forEach((slot: any) => {
      const slotPair: [string, string] = [slot.startTime, slot.endTime]
      if (slot.type === "WORK") {
        workSlots.push(slotPair)
      } else if (slot.type === "BREAK") {
        breakSlots.push(slotPair)
      }
    })
    businessHours[dayKey].work = workSlots
    businessHours[dayKey].break = breakSlots
  })

  return {
    businessName: business.name,
    supportEmail: business.email,
    phone: business.phone,
    address: business.address[0]?.street || "",
    googleMap: business.address[0]?.googleMap || "",
    businessHours,
    businessDays: business.businessAvailability.map(
      (avail: any) => weekdayMap[avail.weekDay]
    ),
    holidays: business.holiday.map((h: any) => weekdayMap[h.holiday]),
  }
}

// Transform form data to PostSupportBusinessDetail
export const transformFormDataForSupportDetail = (
  formData: any
): PostSupportBusinessDetail => {
  const {
    businessName,
    supportEmail,
    phone,
    address,
    googleMap,
    businessHours,
    businessDays,
    holidays,
    businessId,
  } = formData

  const supportAvailability = businessDays.map((day: string) => {
    const hours = businessHours[day] || { work: [], break: [] }
    const timeSlots = [
      ...hours.work.map(([startTime, endTime]: [string, string]) => ({
        type: "WORK" as const,
        startTime,
        endTime,
      })),
      ...hours.break.map(([startTime, endTime]: [string, string]) => ({
        type: "BREAK" as const,
        startTime,
        endTime,
      })),
    ]

    return {
      weekDay: weekdayMap[day] || day,
      type: "SUPPORT" as const,
      timeSlots,
    }
  })

  const supportHoliday = holidays.map((day: string) => ({
    holiday: weekdayMap[day] || day,
    type: "SUPPORT" as const,
    date: "",
  }))

  return {
    supportBusinessName: businessName,
    supportEmail,
    supportPhone: phone,
    supportAddress: address,
    supportGoogleMap: googleMap,
    supportAvailability,
    supportHoliday,
    businessId,
  }
}

export const useSupportTabsStore = create<SupportTabsState>((set) => ({
  activeTab: "Contact Information",
  tabMap: {
    Contact: "Contact Information",
    FAQs: "Frequently Asked Questions (FAQs)",
    Issues: "Customer Support",
    Support: "Admin Support",
  },
  tabs: [
    "Contact Information",
    "Frequently Asked Questions (FAQs)",
    "Customer Support",
    "Admin Support",
  ],
  mTabs: ["Contact", "FAQs", "Issues", "Support"],
  setActiveTab: (tab) => set({ activeTab: tab }),
  handleMobileTabChange: (mobileTab) =>
    set((state) => {
      const mapped = state.tabMap[mobileTab]
      return { activeTab: mapped || state.activeTab }
    }),
  supportDetail: null,
  loading: false,
  error: null,
  setSupportDetail: (detail) => set({ supportDetail: detail, error: null }),
  getSupportBusinessDetailById: async (businessId: string) => {
    set({ loading: true, error: null })
    try {
      const res = await getSupportDetailByBusinessId(businessId)
      console.log("Support detail response:", res)
      if (res.data) {
        set({ supportDetail: res.data, loading: false })
        return { data: res.data, success: true }
      } else {
        set({ supportDetail: null, loading: false })
        return { data: null, success: true }
      }
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch support details",
        loading: false,
      })
      toast.error("Failed to fetch support details")
      return {
        error,
        success: false,
        message: "Failed to fetch support details",
      }
    }
  },
}))
