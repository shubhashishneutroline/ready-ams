import { create } from "zustand";

// props of zustand
type NavState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

// state to track nav toggle
export const useNavStore = create<NavState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
