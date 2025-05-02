import { getBaseUrl } from "@/lib/baseUrl"
import axios, { AxiosError } from "axios"

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
})
export interface Customer {
  id?: number | string
  name: string
  email: string
  phone: string
  password: string
  role: string
  isActive?: boolean
  address?: string
  createdAt?: string
  updatedAt?: string
}

async function getCustomers() {
  try {
    const { data } = await api.get("/api/user")
    return data
  } catch (error) {
    console.error("Error fetching customers:", error)
    return []
  }
}
async function getCoustomersById(id: string) {
  try {
    const { data } = await api.get("/api/user", {
      params: { id },
    })
    const customer = data.find((customer: Customer) => customer.id === id)

    return customer
  } catch (error) {
    console.error("Error fetching customer:", error)
    throw error
  }
}

async function createCustomer(customerData: Customer): Promise<{
  data?: Customer
  success: boolean
  error?: string
  message?: string
}> {
  try {
    const { data } = await api.post("/api/user", customerData)
    console.log(data, "inside create func")
    return { data, success: true }
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        message: error?.response?.data.error,
        success: false,
        error: error.message,
      } // Issue here
    }
    return { error: "Failed to create Customer", success: false }
  }
}

async function updateCustomer(id: string, customerData: Omit<Customer, "id">) {
  try {
    const cleanedData: Record<string, any> = { ...customerData }

    // Remove password if it's empty (to prevent overriding with empty string)
    if (!cleanedData.password) {
      delete cleanedData.password
    }

    // Optional: Remove isActive if not explicitly set (depends on your logic)
    if (cleanedData.isActive === undefined) {
      delete cleanedData.isActive
    }

    console.log(cleanedData, "Cleaned customer data before sending")
    const { data } = await api.put(`/api/user`, {
      ...cleanedData,
      id,
    })

    console.log(data, "inside Update func")
    return data
  } catch (error) {
    console.error("Error updating Customer:", error)
    throw error
  }
}

async function deleteCustomer(id: string) {
  try {
    const { data } = await api.delete(`/api/user${id}`)
    return data
  } catch (error) {
    console.error("Error deleting Customer:", error)
    throw error
  }
}

export {
  getCustomers,
  getCoustomersById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
}
