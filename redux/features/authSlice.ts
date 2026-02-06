import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api"; // make sure this exists

// 🔹 User type
export interface User {
  _id: string; // backend uses _id
  name: string;
  email?: string;
  role?: string;
  username?: string;
  avatar?: {
    key?: string;
    url?: string;
    provider?: string;
  };
  cover?: {
    key?: string;
    url?: string;
    provider?: string;
  };
}

// 🔹 Auth state
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  initialized: boolean; // hydration finished or not
}

// 🔹 Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  initialized: false,
};

// 🔹 Async thunk to fetch current user
export const fetchMe = createAsyncThunk<User>("auth/fetchMe", async () => {
  const res = await api.get("/users/me");
  return res.data.user;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.initialized = true;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    hydrateAuth: (state, action: PayloadAction<{ user: User | null; token: string | null }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.user;
      state.initialized = true;
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      // update localStorage too
      localStorage.setItem("user", JSON.stringify(state.user));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.initialized = true;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMe.fulfilled, (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.initialized = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    });
  },
});

export const { loginSuccess, logout, hydrateAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;
