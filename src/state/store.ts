import { Service } from "@/features/service/api/api"
import { create } from "zustand"

// props of zustand
type NavState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

// state to track nav toggle
export const useNavStore = create<NavState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

// ------ Appointment State
// export type string = "Today" | "Upcoming" | "Completed" | "All"

type AppointmentState = {
  activeTab: string
  onActiveTab: (tab: string) => void
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  activeTab: "Today",
  onActiveTab: (tab: string) => set({ activeTab: tab }),
}))

// Customer State
type CustomerState = {
  activeTab: string
  onActiveTab: (tab: string) => void
}

export const useCustomerStore = create<CustomerState>((set) => ({
  activeTab: "Active",
  onActiveTab: (tab: string) => set({ activeTab: tab }),
}))

// Service  State
interface ServiceStore {
  activeTab: string
  onActiveTab: (tab: string) => void
  services: Service[]
  setServices: (services: Service[]) => void
}

export const useServiceStore = create<ServiceStore>((set) => ({
  activeTab: "Active", // Default to match ServicePage
  onActiveTab: (tab) => set({ activeTab: tab }),
  services: [],
  setServices: (services) => set({ services }),
}))

// Delete Alert State
type DeleteAlertState = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => void
}

export const useDeleteAlertStore = create<DeleteAlertState>((set) => ({
  open: false,
  onOpenChange: (open: boolean) => set({ open }),
  onDelete: () => set({ open: false }),
}))
