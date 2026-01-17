"use client";

import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "@/redux/store";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import System from "@/components/dashboard/side-menu/System";
import Money from "@/components/dashboard/side-menu/Money";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideLayout =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/dashboard");
    pathname.startsWith("/profile");

  return (
    // ✅ Redux Provider ALWAYS mounted
    <Provider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
         <Navbar />

        {!hideLayout ? (
          <div className="grid grid-cols-12 container mx-auto gap-4 mt-4">
            <div className="col-span-2">
              <div className="bg-white p-4 md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button size="icon" variant="outline">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>

                  {/* 🔥 Mobile Sidebar (Scrollable) */}
                  <SheetContent
                    side="left"
                    className="w-72 bg-gray-100 p-0"
                  >
                    <div className="h-screen flex flex-col">

                      {/* Scrollable Menu Area */}
                        <Sidebar />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

            {/* ================= DESKTOP LAYOUT ================= */}
              {/* Sidebar */}
              <aside
                className="
                  hidden md:block
                  md:col-span-3
                  lg:col-span-3
                  sticky top-4
                  bg-white p-4
                  rounded-xl shadow
                  h-fit
                  mt-4
                "
              >
                <Sidebar />
              </aside>
            </div>
            <div className="col-span-8">{children}</div>
            <div className="col-span-2">rightbar</div>
          </div>
        ) : (
          <>{children}</>
        )}
      </GoogleOAuthProvider>
    </Provider>
  );
}
