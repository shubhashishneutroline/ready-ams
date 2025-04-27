import { getBaseUrl } from "@/lib/baseUrl"
import axios from "axios"

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
})

export interface Service {
  id?: string
  title: string
  description: string
  estimatedDuration: number
  status: string
  createdAt?: string
  updatedAt?: string
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
    const { data } = await api.get("/api/service", {
      params: { id },
    })
    const service = data.find((service: Service) => service.id === id)

    return service
  } catch (error) {
    console.error("Error fetching customer:", error)
    throw error
  }
}

async function createService(
  serviceData: Omit<Service, "id">
): Promise<Service> {
  try {
    const { data } = await api.post("/api/service", serviceData)
    return data
  } catch (error) {
    console.error("Error creating service:", error)
    throw error
  }
}

async function  updateService(
  id: string,
  serviceData: Omit<Service, "id">
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

async function deleteService(service: any) {
  try {
    const { data } = await api.delete(`/api/service/`, {
      data: service,
    })
    return data
  } catch (error) {
    console.error("Error deleting service:", error)
    throw error
  }
}

export {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
}
