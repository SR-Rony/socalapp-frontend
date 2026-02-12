"use client";

import { usePathname } from "next/navigation";
import { Provider as ReduxProvider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "@/redux/store";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import RightSidebar from "@/components/sidebar/RightSidebar";
import AppHydration from "./AppHydration";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideLayout =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile");

  return (
    <ReduxProvider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AppHydration> {/* 🔥 Socket setup inside provider */}
          <Navbar />
          {!hideLayout ? (
            <div className="grid grid-cols-12 container mx-auto gap-4">
              <div className="hidden lg:col-span-3 lg:block">
                <aside className="sticky top-4 bg-white p-4 rounded-xl shadow mt-3 h-fit">
                  <Sidebar />
                </aside>
              </div>
              <div className="col-span-12 lg:col-span-6">{children}</div>
              <div className="hidden lg:col-span-3 lg:flex justify-end mt-3">
                <RightSidebar />
              </div>
            </div>
          ) : (
            <>{children}</>
          )}
        </AppHydration>
      </GoogleOAuthProvider>
    </ReduxProvider>
  );
}
