import { getBaseUrl } from "@/lib/baseUrl"
import { Appointment } from "@prisma/client"
import axios, { AxiosError } from "axios"

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
})
console.log(api.defaults.baseURL)
export interface AppointmentData {
  id?: string
  customerName: string
  email: string
  phone: string
  serviceId: string
  selectedDate: string
  selectedTime: string
  message?: string
  userId?: string
  isForSelf?: boolean
  bookedById?: string
  createdById?: string
  status?: string
}

async function getAppointments(): Promise<{
  data?: Appointment[]
  success: boolean
  error?: string
  message?: string
}> {
  try {
    const { data } = await api.get("/api/appointment")
    return { data, success: true }
  } catch (error) {
    console.error("Error fetching appointments:", error)
    if (error instanceof AxiosError) {
      return {
        message: error?.response?.data.error,
        success: false,
        error: error.message,
      } // Issue here
    }
    return { error: "Failed to fetch appointment by Id", success: false }
  }
}

async function getAppointmentById(id: string): Promise<{
  data?: Appointment
  success: boolean
  error?: string
  message?: string
}> {
  try {
    const { data } = await api.get(`/api/appointment/${id}`)

    return { data, success: true }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        message: error?.response?.data.error,
        success: false,
        error: error.message,
      } // Issue here
    }
    return { error: "Failed to fetch appointment by Id", success: false }
  }
}

async function createAppointment(appointmentData: AppointmentData): Promise<{
  data?: AppointmentData
  success: boolean
  error?: string
  message?: string
}> {
  try {
    const { data } = await api.post("/api/appointment", appointmentData)
    return { data, success: true }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        message: error?.response?.data.error,
        success: false,
        error: error.message,
      } // Issue here
    }
    return { error: "Failed to creating appointment", success: false }
  }
}

async function updateAppointment(
  id: string,
  appointmentData: Omit<AppointmentData, "id">
) {
  try {
    const { data } = await api.put(`/api/appointment`, {
      ...appointmentData,
      id,
      status: appointmentData.status || "SCHEDULED",
    })
    return { data, success: true }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        message: error?.response?.data.error,
        success: false,
        error: error.message,
      } // Issue here
    }
    return { error: "Failed to updating appointment", success: false }
  }
}

async function deleteAppointment(
  id: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    const { data } = await api.delete(`/api/appointment/${id}`, {})
    return { message: "Appointment deleted successfully", success: true }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        message: error?.response?.data.error,
        success: false,
        error: error.message,
      } // Issue here
    }
    return { error: "Failed to delete appointment", success: false }
  }
}

export {
  getAppointments,
  createAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
}
