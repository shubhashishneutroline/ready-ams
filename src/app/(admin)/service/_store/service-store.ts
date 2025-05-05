import { create } from "zustand"
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService as apiDeleteService,
} from "@/features/service/api/api"
import { Service } from "@prisma/client"
import { toast } from "sonner"
import { PostServiceData } from "@/features/service/api/api"

interface ServiceState {
  services: Service[]
  serviceById: Service | null
  loading: boolean
  isRefreshing: boolean
  activeTab: string
  hasFetched: boolean
  error: string | null
  setServices: (services: Service[]) => void
  fetchServices: (isManualRefresh?: boolean) => Promise<void>
  fetchServiceById: (id: string) => Promise<void>
  createService: (data: PostServiceData) => Promise<void>
  updateService: (id: string, data: PostServiceData) => Promise<void>
  deleteService: (id: string) => Promise<void>
  onActiveTab: (tab: string) => void
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  serviceById: null,
  loading: true,
  isRefreshing: false,
  activeTab: "Active",
  hasFetched: false,
  error: null,

  setServices: (services) => set({ services }),

  fetchServices: async (isManualRefresh = false) => {
    const { hasFetched } = get()
    if (!isManualRefresh && hasFetched) {
      set({ loading: false })
      return
    }
    try {
      set({ [isManualRefresh ? "isRefreshing" : "loading"]: true, error: null })
      const data = await getServices()
      if (Array.isArray(data)) {
        console.log("useServiceStore: fetchServices: Fetched services =", data)
        set({ services: data, hasFetched: true })
        if (isManualRefresh) {
          const latestService = data[0]
          const message = data.length
            ? `Fetched ${data.length} services.${
                latestService
                  ? ` Latest: ${latestService.title} (${latestService.status})`
                  : ""
              }`
            : "No services found"
          toast.success(message)
        }
      } else {
        throw new Error("Invalid service data: expected an array")
      }
    } catch (error) {
      console.error("useServiceStore: fetchServices: Error =", error)
      set({ error: "Failed to load services", loading: false })
      toast.error("Failed to load services")
    } finally {
      set({ [isManualRefresh ? "isRefreshing" : "loading"]: false })
    }
  },

  fetchServiceById: async (id: string) => {
    const { services } = get()
    const cachedService = services.find((service) => service.id === id)

    if (
      cachedService &&
      cachedService.BusinessDetail &&
      cachedService.serviceAvailability
    ) {
      console.log(
        "useServiceStore: fetchServiceById: Using cached service for id =",
        id
      )
      set({ serviceById: cachedService, loading: false, error: null })
      return
    }

    set({ loading: true, error: null })
    try {
      const service = await getServiceById(id)
      if (service) {
        set({ serviceById: service, loading: false })
      } else {
        throw new Error("Service not found")
      }
    } catch (error: any) {
      console.error("useServiceStore: fetchServiceById: Error =", error)
      set({ error: error.message || "Failed to fetch service", loading: false })
      toast.error("Failed to fetch service")
    }
  },

  createService: async (data: PostServiceData) => {
    try {
      set({ loading: true, error: null })
      const {
        success,
        data: newService,
        message,
        error,
      } = await createService(data)
      if (success && newService) {
        set((state) => ({
          services: [
            {
              ...newService,
              createdAt: new Date(newService.createdAt),
              updatedAt: new Date(newService.updatedAt),
            } as Service,
            ...state.services,
          ],
        }))
        toast.success(message || "Service created successfully")
      } else {
        const errorMsg = message || "Failed to create service"
        set({ error: errorMsg })
        toast.error(errorMsg)
        throw new Error(error || "Failed to create service")
      }
    } catch (error) {
      console.error("useServiceStore: createService: Error =", error)
      set({ error: "Failed to create service" })
      toast.error("Failed to create service")
    } finally {
      set({ loading: false })
    }
  },

  updateService: async (id: string, data: PostServiceData) => {
    try {
      set({ loading: true, error: null })
      const {
        success,
        data: updatedService,
        message,
        error,
      } = await updateService(id, data)
      if (success && updatedService) {
        set((state) => ({
          services: state.services.map((service) =>
            service.id === id
              ? {
                  ...service,
                  ...updatedService,
                  createdAt: new Date(updatedService.createdAt),
                  updatedAt: new Date(updatedService.updatedAt),
                }
              : service
          ),
          serviceById:
            state.serviceById?.id === id
              ? {
                  ...state.serviceById,
                  ...updatedService,
                  createdAt: new Date(updatedService.createdAt),
                  updatedAt: new Date(updatedService.updatedAt),
                }
              : state.serviceById,
        }))
        toast.success(message || "Service updated successfully")
      } else {
        const errorMsg = message || "Failed to update service"
        set({ error: errorMsg })
        toast.error(errorMsg)
        throw new Error(error || "Failed to update service")
      }
    } catch (error) {
      console.error("useServiceStore: updateService: Error =", error)
      set({ error: "Failed to update service" })
      toast.error("Failed to update service")
    } finally {
      set({ loading: false })
    }
  },

  deleteService: async (id: string) => {
    try {
      set({ loading: true, error: null })
      const { success, message, error } = await apiDeleteService(id)
      if (success) {
        set((state) => ({
          services: state.services.filter((item) => item.id !== id),
          serviceById: state.serviceById?.id === id ? null : state.serviceById,
        }))
        toast.success(message || "Service deleted successfully")
      } else {
        const errorMsg = message || "Failed to delete service"
        set({ error: errorMsg })
        toast.error(errorMsg)
        throw new Error(error || "Failed to delete service")
      }
    } catch (error) {
      console.error("useServiceStore: deleteService: Error =", error)
      set({ error: "Failed to delete service" })
      toast.error("Failed to delete service")
    } finally {
      set({ loading: false })
    }
  },

  onActiveTab: (tab) => set({ activeTab: tab.toLowerCase() }),
}))
