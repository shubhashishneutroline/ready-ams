import { create } from "zustand"
import { toast } from "sonner"
import {
  PostCustomerData,
  ApiReturnType,
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/features/customer/api/api"
import { User } from "../_types/customer"
import { AxiosError } from "axios"

interface CustomerState {
  activeTab: string
  customers: User[]
  loading: boolean
  isRefreshing: boolean
  hasFetched: boolean
  error: string | null
  onActiveTab: (tab: string) => void
  fetchCustomers: (isManualRefresh?: boolean) => Promise<void>
  createCustomer: (
    data: PostCustomerData
  ) => Promise<{ success: boolean; message?: string; error?: string }>
  getCustomerById: (id: string) => Promise<User | null>
  updateCustomer: (
    id: string,
    data: PostCustomerData
  ) => Promise<{ success: boolean; message?: string; error?: string }>
  deleteCustomer: (
    id: string
  ) => Promise<{ success: boolean; message?: string; error?: string }>
  getFilteredCustomers: () => User[]
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  activeTab: "All",
  customers: [],
  loading: true,
  isRefreshing: false,
  hasFetched: false,
  error: null,

  onActiveTab: (tab: string) => set({ activeTab: tab }),

  fetchCustomers: async (isManualRefresh = false) => {
    const { hasFetched } = get()
    if (!isManualRefresh && hasFetched) {
      set({ loading: false })
      return
    }
    try {
      set({ [isManualRefresh ? "isRefreshing" : "loading"]: true, error: null })
      const response: ApiReturnType<User[]> = await getCustomers()

      console.log("fetchCustomers response:", response)

      if (response.success && Array.isArray(response.data)) {
        const normalizedCustomers = response.data.map((customer) => ({
          ...customer,
          isActive: customer.isActive ?? true,
        }))
        set({ customers: normalizedCustomers, hasFetched: true })
        if (isManualRefresh) {
          const latestCustomer = normalizedCustomers[0]
          const toastMessage = normalizedCustomers.length
            ? `Fetched ${normalizedCustomers.length} customers.${
                latestCustomer
                  ? ` Latest: ${latestCustomer.name} (${latestCustomer.isActive ? "Active" : "Inactive"})`
                  : ""
              }`
            : "No customers found"
          toast.success(toastMessage)
        }
      } else {
        const errorMsg = response.message || "Failed to load customers"
        console.warn(
          "fetchCustomers: response.data is not an array or success is false",
          response
        )
        set({ customers: [], error: errorMsg })
        toast.error(errorMsg)
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
      const errorMsg = "Failed to fetch customers"
      set({ customers: [], error: errorMsg })
      toast.error(errorMsg)
    } finally {
      set({ [isManualRefresh ? "isRefreshing" : "loading"]: false })
    }
  },

  createCustomer: async (postData: PostCustomerData) => {
    try {
      const response: ApiReturnType<any> = await createCustomer(postData)
      console.log("createCustomer response in store:", response)
      if (response.success && response.data) {
        set((state) => ({
          customers: [
            {
              ...response.data,
              createdAt: new Date(response.data.createdAt),
              updatedAt: new Date(response.data.updatedAt),
              isActive: response.data.isActive ?? true,
            },
            ...state.customers,
          ],
        }))
        toast.success(response.message || "Customer created successfully")
        return {
          success: true,
          message: response.message || "Customer created successfully",
        }
      } else {
        const errorMsg = response.message || "Failed to create customer"
        toast.error(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (error) {
      console.error("Error creating customer:", error)
      const errorMsg = "Failed to create customer"
      toast.error(errorMsg)
      return { success: false, error: errorMsg }
    }
  },

  getCustomerById: async (id) => {
    try {
      const response: ApiReturnType<User> = await getCustomerById(id)
      if (response.success && response.data) {
        return {
          ...response.data,
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
          isActive: response.data.isActive ?? true,
        }
      } else {
        const errorMsg = response.message || "Failed to fetch customer"
        toast.error(errorMsg)
        return null
      }
    } catch (error) {
      console.error("Error fetching customer by ID:", error)
      toast.error("Failed to fetch customer")
      return null
    }
  },

  updateCustomer: async (id, postData) => {
    try {
      const { success, data, message, error }: ApiReturnType<User> =
        await updateCustomer(id, postData)
      if (success && data) {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id
              ? {
                  ...customer,
                  ...data,
                  createdAt: new Date(data.createdAt),
                  updatedAt: new Date(data.updatedAt),
                  isActive: data.isActive ?? true,
                }
              : customer
          ),
        }))
        toast.success(message || "Customer updated successfully")
        return {
          success: true,
          message: message || "Customer updated successfully",
        }
      } else {
        const errorMsg = message || "Failed to update customer"
        toast.error(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError
          ? error.response?.data.message || "Failed to update customer"
          : "Failed to update customer"
      console.error("Error updating customer:", error)
      toast.error(errorMsg)
      return { success: false, error: errorMsg }
    }
  },

  deleteCustomer: async (id) => {
    try {
      const response = await deleteCustomer(id)
      if (response.success) {
        set((state) => ({
          customers: state.customers.filter((customer) => customer.id !== id),
        }))
        toast.success(response.message || "Customer deleted successfully")
        return {
          success: true,
          message: response.message || "Customer deleted successfully",
        }
      } else {
        const errorMsg = response.message || "Failed to delete customer"
        toast.error(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (error) {
      console.error("Error deleting customer:", error)
      const errorMsg = "Failed to delete customer"
      toast.error(errorMsg)
      return { success: false, error: errorMsg }
    }
  },

  getFilteredCustomers: () => {
    const { customers, activeTab } = get()
    if (!Array.isArray(customers)) {
      console.warn(
        "getFilteredCustomers: customers is not an array:",
        customers
      )
      return []
    }
    return customers.filter((customer) => {
      if (activeTab === "Active") {
        return customer.isActive === true
      } else if (activeTab === "Inactive") {
        return customer.isActive === false
      }
      return true // 'All' tab
    })
  },
}))
