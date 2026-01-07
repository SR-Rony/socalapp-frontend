"use client";

import { LayoutDashboard, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import System from "@/components/dashboard/side-menu/System";
import UserMenu from "@/components/dashboard/side-menu/User";
import Module from "@/components/dashboard/side-menu/Modules";

import { usePathname } from "next/navigation";
import Money from "@/components/dashboard/side-menu/Money";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 🔹 Route থেকে title বের করা
  const lastRoute = pathname
    .split("/")
    .filter(Boolean)
    .pop();

  const title = lastRoute?.toUpperCase() || "DASHBOARD";

  return (
    <div className="min-h-screen mt-5">
      <div className="container mx-auto px-4">

        {/* ================= MOBILE HEADER ================= */}
        <div className="flex items-center gap-3 py-4 md:hidden">
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

                {/* Fixed Header */}
                <div className="px-4 py-3 border-b font-semibold text-lg">
                  Dashboard Menu
                </div>

                {/* Scrollable Menu Area */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                  <System />
                  <UserMenu />
                  <Module />
                  <Money />
                </div>

              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>

        {/* ================= DESKTOP LAYOUT ================= */}
        <div className="grid grid-cols-12 gap-4">

          {/* Sidebar */}
          <aside
            className="
              hidden md:block
              md:col-span-3
              lg:col-span-3
              sticky top-4
              h-fit
              mt-4
            "
          >
            <System />
            <UserMenu />
            <Module />
            <Money />
          </aside>

          {/* Main Content */}
          <main
            className="
              col-span-12
              md:col-span-9
              lg:col-span-9
              p-4
              relative
            "
          >
            <h1
              className="
                text-2xl font-bold mb-4
                bg-white
                py-4
                flex items-center gap-2
                top-0 left-0
                w-full
                px-6
                rounded-t-xl
              "
            >
              <LayoutDashboard className="h-6 w-6" />
              <span>{title}</span>
            </h1>

            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
