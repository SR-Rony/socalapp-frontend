
import { LayoutDashboard, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserMenu from "@/components/dashboard/side-menu/User";
import System from "@/components/dashboard/side-menu/System";
import Module from "@/components/dashboard/side-menu/Modules";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen mt-5">
      <div className="container mx-auto px-4">

        {/* 🔹 Mobile Header */}
        <div className="flex items-center gap-2 py-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 bg-gray-100">
              <System />
              <UserMenu />
            </SheetContent>
          </Sheet>

          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>

        {/* 🔹 Desktop Layout */}
        <div className="grid grid-row grid-cols-12 gap-4">

          {/* Sidebar */}
          <aside
            className="
              hidden md:block
              md:col-span-3
              lg:col-span-3
              sticky top-4
              h-fit
            "
          >
            <System />
            <UserMenu />
            <Module />
          </aside>

          {/* Main Content */}
          <main
            className="
              col-span-12
              md:col-span-9
              lg:col-span-9
              bg-white
              rounded-xl
              shadow
              p-6
              relative
            "
          >
            <h1 className="text-2xl font-bold mb-4 bg-secondary py-4 flex items-center gap-2 top-0 left-0 w-full px-6 rounded-t-xl ">
                <LayoutDashboard/>
                <span>Dashboard</span>
            </h1>
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
