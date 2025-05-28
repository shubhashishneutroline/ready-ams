import { create } from 'zustand';

interface IndividualNavState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
}

export const useIndividualNavStore = create<IndividualNavState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
