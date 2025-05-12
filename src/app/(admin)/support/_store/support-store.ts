// store/supportTabsStore.ts
import { create } from "zustand"

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
}))
