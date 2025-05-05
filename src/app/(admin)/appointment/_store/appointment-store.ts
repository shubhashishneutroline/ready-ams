import { create } from "zustand"
import { Appointment } from "@prisma/client"
import {
  getAppointments,
  createAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  PostAppoinmentData,
} from "@/features/appointment/api/api"
import { toast } from "sonner"
import { isSameDay } from "date-fns"

export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  MISSED = "MISSED",
  CANCELLED = "CANCELLED",
  FOLLOW_UP = "FOLLOW_UP",
}

interface AppointmentState {
  activeTab: string
  appointments: Appointment[]
  loading: boolean
  isRefreshing: boolean
  hasFetched: boolean
  error: string | null
  router: string
  onActiveTab: (tab: string) => void
  fetchAppointments: (isManualRefresh?: boolean) => Promise<void>
  createAppointment: (
    data: PostAppoinmentData
  ) => Promise<{ success: boolean; message?: string; error?: string }>
  getAppointmentById: (id: string) => Promise<Appointment | null>
  updateAppointment: (
    id: string,
    data: PostAppoinmentData
  ) => Promise<{ success: boolean; message?: string; error?: string }>
  deleteAppointment: (
    id: string
  ) => Promise<{ success: boolean; message?: string; error?: string }>
  getFilteredAppointments: () => Appointment[]
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  activeTab: "Today",
  appointments: [],
  loading: true,
  isRefreshing: false,
  hasFetched: false,
  error: null,
  router: "/appointment",
  onActiveTab: (tab: string) => set({ activeTab: tab }),

  fetchAppointments: async (isManualRefresh = false) => {
    const { hasFetched } = get()
    if (!isManualRefresh && hasFetched) {
      set({ loading: false })
      return
    }
    try {
      set({ [isManualRefresh ? "isRefreshing" : "loading"]: true, error: null })
      const { success, data, message, error } = await getAppointments()

      if (success && Array.isArray(data)) {
        const normalizedData = data.map((appt) => ({
          ...appt,
          selectedDate: new Date(appt.selectedDate),
          selectedTime: appt.selectedTime,
          status: appt.status as AppointmentStatus,
        }))
        set({ appointments: normalizedData, hasFetched: true })
        if (isManualRefresh) {
          const latestAppointment = normalizedData[0]
          const toastMessage = normalizedData.length
            ? `Fetched ${normalizedData.length} appointments.${
                latestAppointment
                  ? ` Latest: ${latestAppointment.customerName} (${latestAppointment.status})`
                  : ""
              }`
            : "No appointments found"
          toast.success(toastMessage)
        }
      } else {
        const errorMsg = message || "Failed to load appointments"
        set({ appointments: [], error: errorMsg })
        toast.error(errorMsg)
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
      const errorMsg = "Failed to fetch appointments"
      set({ appointments: [], error: errorMsg })
      toast.error(errorMsg)
    } finally {
      set({ [isManualRefresh ? "isRefreshing" : "loading"]: false })
    }
  },

  createAppointment: async (postData: PostAppoinmentData) => {
    try {
      const { success, data, message, error } =
        await createAppointment(postData)
      if (success && data) {
        set((state) => ({
          appointments: [
            ...state.appointments,
            {
              ...data,
              status: (data?.status || "SCHEDULED") as AppointmentStatus,
              selectedDate: new Date(data.selectedDate),
              selectedTime: data.selectedTime,
              cancelledAt: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            } as Appointment,
          ],
        }))
        toast.success(message || "Appointment created successfully")
        return {
          success: true,
          message: message || "Appointment created successfully",
        }
      } else {
        const errorMsg = message || "Failed to create appointment"
        toast.error(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (error) {
      console.error("Error creating appointment:", error)
      const errorMsg = "Failed to create appointment"
      toast.error(errorMsg)
      return { success: false, error: errorMsg }
    }
  },

  getAppointmentById: async (id) => {
    try {
      const { success, data, message, error } = await getAppointmentById(id)
      if (success && data) {
        return {
          ...data,
          selectedDate: new Date(data.selectedDate),
          selectedTime: data.selectedTime,
          status: data.status as AppointmentStatus,
        }
      } else {
        const errorMsg = message || "Failed to fetch appointment"
        toast.error(errorMsg)
        return null
      }
    } catch (error) {
      console.error("Error fetching appointment by ID:", error)
      toast.error("Failed to fetch appointment")
      return null
    }
  },

  updateAppointment: async (id, postData) => {
    try {
      const { success, data, message, error } = await updateAppointment(
        id,
        postData
      )
      if (success && data) {
        set((state) => ({
          appointments: state.appointments.map((appt) =>
            appt.id === id
              ? {
                  ...appt,
                  ...data,
                  status: (data?.status || appt.status) as AppointmentStatus,
                  selectedDate: new Date(data!.selectedDate),
                  selectedTime: data!.selectedTime,
                }
              : appt
          ),
        }))
        toast.success(message || "Appointment updated successfully")
        return {
          success: true,
          message: message || "Appointment updated successfully",
        }
      } else {
        const errorMsg = message || "Failed to update appointment"
        toast.error(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (error) {
      console.error("Error updating appointment:", error)
      const errorMsg = "Failed to update appointment"
      toast.error(errorMsg)
      return { success: false, error: errorMsg }
    }
  },

  deleteAppointment: async (id) => {
    try {
      const response = await deleteAppointment(id)
      if (response.success) {
        set((state) => ({
          appointments: state.appointments.filter((appt) => appt.id !== id),
        }))
        toast.success(response.message || "Appointment deleted successfully")
        return {
          success: true,
          message: response.message || "Appointment deleted successfully",
        }
      } else {
        const errorMsg = response.message || "Failed to delete appointment"
        toast.error(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (error) {
      console.error("Error deleting appointment:", error)
      const errorMsg = "Failed to delete appointment"
      toast.error(errorMsg)
      return { success: false, error: errorMsg }
    }
  },

  getFilteredAppointments: () => {
    const { appointments, activeTab } = get()
    if (!Array.isArray(appointments)) {
      console.warn("appointments is not an array:", appointments)
      return []
    }
    return appointments.filter((item) => {
      const isValidDate =
        item.selectedDate instanceof Date && !isNaN(item.selectedDate.getTime())
      const isValidStatus = Object.values(AppointmentStatus).includes(
        item.status as AppointmentStatus
      )
      if (activeTab === "Today") {
        return isValidDate && isSameDay(item.selectedDate, new Date())
      } else if (activeTab === "Upcoming") {
        return isValidStatus && item.status === AppointmentStatus.SCHEDULED
      } else if (activeTab === "Completed") {
        return isValidStatus && item.status === AppointmentStatus.COMPLETED
      } else if (activeTab === "Missed") {
        return isValidStatus && item.status === AppointmentStatus.MISSED
      } else if (activeTab === "Cancelled") {
        return isValidStatus && item.status === AppointmentStatus.CANCELLED
      }
      return true // 'All' tab
    })
  },
}))
