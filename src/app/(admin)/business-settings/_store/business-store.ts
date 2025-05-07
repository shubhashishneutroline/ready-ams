import { create } from "zustand"
import { toast } from "sonner"
import {
  getBusinesses,
  getBusinessById,
} from "@/features/business-detail/api/api"
// import { getBusinessDetailById } from "@/db/businessDetail"

export interface BusinessDetail {
  id: string
  name: string
  industry: string
  email: string
  phone: string
  website: string
  businessRegistrationNumber: string
  status: string
  businessOwner: string
  createdAt: Date
  updatedAt: Date
  businessAvailability: Array<{
    id: string
    weekDay: string
    type: string
    timeSlots: Array<{
      id: string
      type: string
      startTime: string
      endTime: string
    }>
  }>
  holiday: Array<{
    id: string
    holiday: string
    date: string
  }>
  address: Array<{
    id: string
    street: string
    city: string
    country: string
    zipCode: string
    googleMap: string
    businessId: string
    supportId: string | null
  }>
}

interface BusinessState {
  businesses: BusinessDetail[]
  selectedBusiness: BusinessDetail | null
  loading: boolean
  isRefreshing: boolean
  hasFetched: boolean
  error: string | null
  fetchBusinesses: (
    businessOwnerId: string,
    isManualRefresh?: boolean
  ) => Promise<void>
  fetchBusinessById: (businessId: string) => Promise<void>
}

export const useBusinessStore = create<BusinessState>((set, get) => ({
  businesses: [],
  selectedBusiness: null,
  loading: true,
  isRefreshing: false,
  hasFetched: false,
  error: null,
  fetchBusinesses: async (businessOwnerId, isManualRefresh = false) => {
    const { hasFetched } = get()
    if (!isManualRefresh && hasFetched) {
      set({ loading: false })
      return
    }
    try {
      set({ [isManualRefresh ? "isRefreshing" : "loading"]: true, error: null })
      const response = await getBusinesses()
      console.log("useBusinessStore: fetchBusinesses: Response =", response)
      if (response.success && Array.isArray(response.data)) {
        set({
          businesses: response.data,
          hasFetched: true,
          error: null,
        })
        if (isManualRefresh) {
          const toastMessage = response.data.length
            ? `Fetched ${response.data.length} businesses`
            : "No businesses found"
          toast.success(toastMessage, { id: "fetch-businesses" })
        }
      } else {
        const errorMessage = response.message || "Failed to fetch businesses"
        set({
          businesses: [],
          error: errorMessage,
          hasFetched: true,
        })
        if (isManualRefresh) {
          toast.error(errorMessage, { id: "fetch-businesses" })
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch businesses"
      console.error("useBusinessStore: fetchBusinesses: Error =", error)
      set({
        businesses: [],
        error: errorMessage,
        hasFetched: true,
      })
      if (isManualRefresh) {
        toast.error(errorMessage, { id: "fetch-businesses" })
      }
    } finally {
      set({ [isManualRefresh ? "isRefreshing" : "loading"]: false })
    }
  },
  fetchBusinessById: async (businessId) => {
    try {
      set({ loading: true, error: null })
      const response = await getBusinessById(businessId)

      console.log("useBusinessStore: fetchBusinessById: Response =", response)
      if (response) {
        set({
          selectedBusiness: response,
          error: null,
        })
        toast.success("Business fetched successfully", {
          id: "fetch-business-by-id",
        })
      } else {
        const errorMessage = "Business not found"
        set({
          selectedBusiness: null,
          error: errorMessage,
        })
        toast.error(errorMessage, { id: "fetch-business-by-id" })
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch business"
      console.error("useBusinessStore: fetchBusinessById: Error =", error)
      set({
        selectedBusiness: null,
        error: errorMessage,
      })
      toast.error(errorMessage, { id: "fetch-business-by-id" })
    } finally {
      set({ loading: false })
    }
  },
}))
