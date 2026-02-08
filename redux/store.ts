import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import storyReducer from "./features/storySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    story: storyReducer,
    // অন্যান্য slice add করতে পারো
  },
  devTools: true, // dev mode এ debug করা সহজ
});

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
