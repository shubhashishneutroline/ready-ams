import { BusinessDetail } from "@/features/business-detail/types/types"
import { getBaseUrl } from "@/lib/baseUrl"
import { Service } from "@prisma/client"
import axios, { AxiosError } from "axios"

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
})

export interface ServiceAvailability {
  day: string
  startTime: string
  endTime: string
}

export interface PostServiceData {
  id?: string
  title: string
  description: string
  estimatedDuration: number
  status: string
  createdAt?: string
  updatedAt?: string
  serviceAvailability?: ServiceAvailability[]
  businessDetailId?: string
  BusinessDetail?: BusinessDetail[]
}

async function getServices(): Promise<Service[]> {
  try {
    const { data } = await api.get("/api/service")
    return data
  } catch (error) {
    console.error("Error fetching services:", error)
    return []
  }
}

async function getServiceById(id: string) {
  try {
    const { data } = await api.get(`/api/service/${id}`)

    return data
  } catch (error) {
    console.error("Error fetching customer:", error)
    throw error
  }
}

async function createService(serviceData: PostServiceData): Promise<{
  data?: Service
  success: boolean
  error?: string
  message?: string
}> {
  try {
    const { data } = await api.post("/api/service", serviceData)
    return { data, success: true }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        message: error?.response?.data.error,
        success: false,
        error: error.message,
      } // Issue here
    }
    return { error: "Failed to delete service", success: false }
  }
}

async function updateService(
  id: string,
  serviceData: Omit<PostServiceData, "id">
): Promise<Service> {
  try {
    const { data } = await api.put(`/api/service/${id}`, {
      ...serviceData,
      id, // Include id in the body if required by the backend
    })
    return data
  } catch (error) {
    console.error("Error updating service:", error)
    throw error
  }
}

async function deleteService(id: string): Promise<{
  data?: Service
  success: boolean
  error?: string
  message?: string
}> {
  try {
    const { data } = await api.delete(`/api/service/${id}`)

    return { data, success: true }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        message: error?.response?.data.error,
        success: false,
        error: error.message,
      } // Issue here
    }
    return { error: "Failed to delete service", success: false }
  }
}

export {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
}
