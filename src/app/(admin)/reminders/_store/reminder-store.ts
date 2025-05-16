import { create } from "zustand"
import { toast } from "sonner"
import {
  getReminder,
  getReminderById,
  createReminder,
  updateReminder,
} from "@/features/reminder/api/api"
import { Reminder } from "@/data/structure"

// Standardized API response type
interface ApiCallReturnType {
  data?: any
  success: boolean
  message?: string
  error?: string
}

interface ReminderState {
  activeTab: string
  onActiveTab: (tab: string) => void
  reminderTab: string
  reminders: Reminder[]
  loading: boolean
  isRefreshing: boolean
  hasFetched: boolean
  error: string | null
  router: string
  onReminderTab: (tab: string) => void
  fetchReminders: (isManualRefresh?: boolean) => Promise<void>
  getReminderById: (id: string) => Promise<Reminder | null>
  createReminder: (
    data: any
  ) => Promise<{ success: boolean; message?: string; errorMessage?: string }>
  updateReminder: (
    id: string,
    data: any
  ) => Promise<{ success: boolean; message?: string; errorMessage?: string }>
  getFilteredReminders: () => Reminder[]
}

// Centralized error handling utility
const handleApiError = (
  error: any,
  defaultMessage: string,
  set: (state: Partial<ReminderState>) => void,
  showToast: boolean = true
): { success: boolean; errorMessage: string } => {
  const errorMessage = error instanceof Error ? error.message : defaultMessage
  console.error(`${defaultMessage}:`, error)
  set({ error: errorMessage })
  if (showToast) {
    toast.error(errorMessage, { id: "reminder-error" })
  }
  return { success: false, errorMessage }
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  activeTab: "Reminder",
  reminderTab: "Reminder",
  reminders: [],
  loading: true,
  isRefreshing: false,
  hasFetched: false,
  error: null,
  router: "/reminders",

  onReminderTab: (tab: string) => set({ reminderTab: tab }),
  onActiveTab: (tab: string) => set({ activeTab: tab }),
  fetchReminders: async (isManualRefresh = false) => {
    const { hasFetched } = get()
    if (!isManualRefresh && hasFetched) {
      set({ loading: false })
      return
    }
    try {
      set({ [isManualRefresh ? "isRefreshing" : "loading"]: true, error: null })
      const response: ApiCallReturnType = await getReminder()
      console.log("fetchReminders: Response >>>>=", response)

      if (response.success && Array.isArray(response.data)) {
        const normalizedData = response.data.map((reminder: Reminder) => ({
          ...reminder,
        }))
        console.log("fetchReminders: Fetched reminders =", normalizedData)
        set({ reminders: normalizedData, hasFetched: true })
        if (isManualRefresh) {
          const latestReminder = normalizedData[0]
          const toastMessage = normalizedData.length
            ? `Fetched ${normalizedData.length} reminders.${
                latestReminder ? ` Latest: ${latestReminder.title}` : ""
              }`
            : "No reminders found"
          toast.success(toastMessage, { id: "fetch-reminders" })
        }
      } else {
        const errorMessage =
          response.message || response.error || "Failed to load reminders"
        set({ reminders: [], error: errorMessage })
        if (isManualRefresh) {
          toast.error(errorMessage, {
            id: "fetch-reminders",
            duration: 3000,
            description: "Please check the server or try again later.",
          })
        }
      }
    } catch (error) {
      handleApiError(error, "Failed to fetch reminders", set, isManualRefresh)
    } finally {
      set({ [isManualRefresh ? "isRefreshing" : "loading"]: false })
    }
  },

  getReminderById: async (id: string) => {
    try {
      const response: ApiCallReturnType = await getReminderById(id)
      console.log("getReminderById: Response =", response)
      if (response.success && response.data) {
        return {
          ...response.data,
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
        }
      } else {
        const errorMessage =
          response.message || response.error || "Failed to fetch reminder"
        toast.error(errorMessage, { id: "fetch-reminder" })
        return null
      }
    } catch (error) {
      handleApiError(error, "Failed to fetch reminder", set)
      return null
    }
  },

  createReminder: async (data: any) => {
    try {
      const response: ApiCallReturnType = await createReminder(data)
      console.log("createReminder: Response =", response)
      if (response.success && response.data) {
        set((state) => ({
          reminders: [
            {
              ...response.data,
              createdAt: new Date(response.data.createdAt || new Date()),
              updatedAt: new Date(response.data.updatedAt || new Date()),
            } as Reminder,
            ...state.reminders,
          ],
        }))
        toast.success(response.message || "Reminder created successfully", {
          id: "create-reminder",
        })
        return {
          success: true,
          message: response.message || "Reminder created successfully",
        }
      } else {
        const errorMessage =
          response.message || response.error || "Failed to create reminder"
        toast.error(errorMessage, { id: "create-reminder" })
        return { success: false, errorMessage }
      }
    } catch (error) {
      return handleApiError(error, "Failed to create reminder", set)
    }
  },

  updateReminder: async (id: string, data: any) => {
    try {
      const response: ApiCallReturnType = await updateReminder(id, data)
      console.log("updateReminder: Response =", response)
      if (response.success && response.data) {
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id
              ? {
                  ...reminder,
                  ...response.data,
                  createdAt: new Date(response.data.createdAt),
                  updatedAt: new Date(response.data.updatedAt || new Date()),
                }
              : reminder
          ),
        }))
        toast.success(response.message || "Reminder updated successfully", {
          id: "update-reminder",
        })
        return {
          success: true,
          message: response.message || "Reminder updated successfully",
        }
      } else {
        const errorMessage =
          response.message || response.error || "Failed to update reminder"
        toast.error(errorMessage, { id: "update-reminder" })
        return { success: false, errorMessage }
      }
    } catch (error) {
      return handleApiError(error, "Failed to update reminder", set)
    }
  },

  getFilteredReminders: () => {
    const { reminders, reminderTab } = get()
    console.log("getFilteredReminders: reminders =====", reminders)
    if (!Array.isArray(reminders)) {
      console.warn("reminders is not an array:", reminders)
      return []
    }
    return reminders.filter((item) => {
      if (reminderTab === "Reminder") {
        return item.type === "REMINDER"
      } else if (reminderTab === "Follow up") {
        return item.type === "FOLLOW_UP"
      } else if (reminderTab === "Cancellation") {
        return item.type === "CANCELLATION"
      } else if (reminderTab === "Missed") {
        return item.type === "MISSED"
      } else if (reminderTab === "Custom") {
        return item.type === "CUSTOM"
      }
      return item.type === "REMINDER" // Default to REMINDER if reminderTab is invalid
    })
  },
}))
