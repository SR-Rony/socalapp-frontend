"use client";

import { usePathname } from "next/navigation";
import { Provider as ReduxProvider } from "react-redux"; // ✅ Redux provider
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "@/redux/store";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import RightSidebar from "@/components/sidebar/RightSidebar";
import AppHydration from "./AppHydration";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages where we hide navbar/sidebar layout
  const hideLayout =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile");

  return (
    <ReduxProvider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AppHydration>
          <Navbar />

          {!hideLayout ? (
            <div className="grid grid-cols-12 container mx-auto gap-4">
              {/* Left Sidebar */}
              <div className="hidden md:col-span-3 md:block">
                <aside className="sticky top-4 bg-white p-4 rounded-xl shadow mt-3 h-fit">
                  <Sidebar />
                </aside>
              </div>

              {/* Main Content */}
              <div className="col-span-12 md:col-span-6">{children}</div>

              {/* Right Sidebar */}
              <div className="hidden md:col-span-3 md:flex justify-end mt-3">
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
