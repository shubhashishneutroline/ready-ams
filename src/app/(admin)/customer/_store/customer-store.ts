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
  createCustomer: (data: PostCustomerData) => Promise<void>
  getCustomerById: (id: string) => Promise<User | null>
  updateCustomer: (id: string, data: PostCustomerData) => Promise<void>
  deleteCustomer: (id: string) => Promise<void>
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
        // Normalize isActive to ensure no undefined values
        const normalizedCustomers = response.data.map((customer) => ({
          ...customer,
          isActive: customer.isActive ?? true, // Default to true if undefined
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
              isActive: response.data.isActive ?? true, // Normalize isActive
            },
            ...state.customers,
          ],
        }))
        toast.success(response.message || "Customer created successfully")
      } else {
        const errorMsg = response.message || "Failed to create customer"
        toast.error(errorMsg)
        throw new Error(response.error || "Failed to create customer")
      }
    } catch (error) {
      console.error("Error creating customer:", error)
      toast.error("Failed to create customer")
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
          isActive: response.data.isActive ?? true, // Normalize isActive
        }
      } else {
        const errorMsg = response.message || "Failed to fetch customer"
        toast.error(errorMsg)
        throw new Error(response.error || "Failed to fetch customer")
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
                  isActive: data.isActive ?? true, // Normalize isActive
                }
              : customer
          ),
        }))
        toast.success(message || "Customer updated successfully")
      } else {
        const errorMsg = message || "Failed to update customer"
        toast.error(errorMsg)
        throw new Error(error || "Failed to update customer")
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error updating customer:", error)
        toast.error(error.response?.data.message || "Failed to update customer")
      }
      console.error("Error updating customer:", error)
      toast.error("Failed to update customer")
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
      } else {
        const errorMsg = response.message || "Failed to delete customer"
        toast.error(errorMsg)
        throw new Error(response.error || "Failed to delete customer")
      }
    } catch (error) {
      console.error("Error deleting customer:", error)
      toast.error("Failed to delete customer")
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
