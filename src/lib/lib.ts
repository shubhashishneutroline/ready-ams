import { AppDispatch, AppStore } from "@/state/store";

import { useDispatch, useStore } from "react-redux";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppStore = useStore.withTypes<AppStore>();
