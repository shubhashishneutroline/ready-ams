// store/supportTabsStore.ts
import { SupportBusinessDetail } from "@prisma/client"
import { create } from "zustand"
import { getSupportDetailByBusinessId } from "../_api-call/support-api-call"
import { useBusinessStore } from "../../business-settings/_store/business-store"
import { PostSupportBusinessDetail } from "../_types/types"

// Define the valid mobile tab names as a TypeScript type
// Ensures only specific keys ("Contact", "FAQs", "Issues", "Support") are used
export type TabMapKey = "Contact" | "FAQs" | "Issues" | "Support"

// Define the store's state and actions
interface SupportTabsState {
  // Current active tab (uses desktop tab names, e.g., "Contact Information")
  activeTab: string
  // Object mapping mobile tab names to desktop tab names
  tabMap: Record<TabMapKey, string>
  // Array of desktop tab names
  tabs: string[]
  // Array of mobile tab names
  mTabs: TabMapKey[]
  // Function to update activeTab (used for desktop tabs)
  setActiveTab: (tab: string) => void
  // Function to handle mobile tab changes (converts mobile to desktop tab name)
  handleMobileTabChange: (mobileTab: TabMapKey) => void

  // get support business details
  getSupportBusinessDetails: () => Promise<void>
  // get support business by Id
  getSupportBusinessDetailById: (businessId: string) => Promise<any>
}

// Create the Zustand store
export const useSupportTabsStore = create<SupportTabsState>((set) => ({
  // Initial active tab
  activeTab: "Contact Information",

  // Mapping of mobile to desktop tab names
  tabMap: {
    Contact: "Contact Information",
    FAQs: "Frequently Asked Questions (FAQs)",
    Issues: "Customer Support",
    Support: "Admin Support",
  },

  // Desktop tab names
  tabs: [
    "Contact Information",
    "Frequently Asked Questions (FAQs)",
    "Customer Support",
    "Admin Support",
  ],

  // Mobile tab names
  mTabs: ["Contact", "FAQs", "Issues", "Support"],

  // Function to set activeTab (used for desktop tabs)
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Function to handle mobile tab clicks
  // Converts mobile tab name (e.g., "Contact") to desktop tab name (e.g., "Contact Information")
  handleMobileTabChange: (mobileTab) =>
    set((state) => {
      const mapped = state.tabMap[mobileTab] // Get desktop tab name
      return { activeTab: mapped || state.activeTab } // Update if valid, else keep current
    }),

  // Get support business details
  getSupportBusinessDetails: async () => {},

  // Get support business by Id
  getSupportBusinessDetailById: async (businessId: string) => {
    try {
      const res = await getSupportDetailByBusinessId(businessId)
      console.log(res, "inside Business details, store")

      //   set({ supportBusinessDetail: transformBusinessDataForSupport(res) })
      return { data: res, success: true }
    } catch (error) {
      console.error("Error fetching business:", error)
      return { error, success: false, message: "Failed to fetch business" }
    }
  },
}))

// Transform business data from useBusinessStore to SupportBusinessDetail format
// features/support-detail/action/action.ts

// Weekday mapping to match database convention
const weekdayMap: { [key: string]: string } = {
  Mon: "MONDAY",
  Tue: "TUESDAY",
  Wed: "WEDNESDAY",
  Thu: "THURSDAY",
  Fri: "FRIDAY",
  Sat: "SATURDAY",
  Sun: "SUNDAY",
}

// Transform form data to SupportBusinessDetail format
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

  // Transform businessHours to supportAvailability
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

  // Transform holidays to supportHoliday
  const supportHoliday = holidays.map((day: string) => ({
    holiday: weekdayMap[day] || day,
    type: "SUPPORT" as const,
    date: "",
  }))

  // Return transformed data
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
