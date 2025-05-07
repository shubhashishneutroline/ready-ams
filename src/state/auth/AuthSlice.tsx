import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  id: string;
  email: string;
  name: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  lastActive: string;
  role: string;
  isActive: boolean;
}

const initialState: AuthState = {
  id: "cm9jwyw680003urk225chcs1g",
  email: "basnetshubhashish7@gmail.com",
  name: "Hritik Roshan 1223",
  phone: "+9779848554742",
  createdAt: "2025-04-16T12:34:44.192Z",
  updatedAt: "2025-04-16T13:21:41.191Z",
  lastActive: "2025-04-16T12:34:44.192Z",
  role: "ADMIN",
  isActive: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<Partial<AuthState>>) {
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
      };
    },
    logout(state) {
      return {
        ...initialState,
        isAuthenticated: false,
      };
    },
  },
});

export const { setAuthUser, logout } = authSlice.actions;
export default authSlice.reducer;
