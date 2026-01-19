"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hook/hook";
import { hydrateAuth } from "@/redux/features/authSlice";

export default function AppHydration({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (token && user) {
      dispatch(hydrateAuth({ token, user }));
    }
  }, [dispatch]);

  return <>{children}</>;
}
