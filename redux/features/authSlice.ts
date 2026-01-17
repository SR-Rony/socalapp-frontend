// redux/features/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  initialized: boolean; // 🔹 hydration finished or not
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🔹 login (google / email)
    loginSuccess: (
      state,
      action: PayloadAction<{ user: any; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.initialized = true;
    },

    // 🔹 restore from localStorage on reload
    hydrateAuth: (
      state,
      action: PayloadAction<{ user: any | null; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.initialized = true;
    },

    // 🔹 logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.initialized = true;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, logout, hydrateAuth } =
  authSlice.actions;

export default authSlice.reducer;
