
import Sidebar from "@/components/dashboard/sightbar/sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4">

        {/* 🔹 Mobile Header */}
        <div className="flex items-center gap-2 py-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72">
              <Sidebar />
            </SheetContent>
          </Sheet>

          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>

        {/* 🔹 Desktop Layout */}
        <div className="grid grid-cols-12 gap-4">

          {/* Sidebar */}
          <aside
            className="
              hidden md:block
              md:col-span-3
              lg:col-span-3
              bg-white
              rounded-xl
              shadow
              p-4
              sticky top-4
              h-fit
            "
          >
            <Sidebar />
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
            "
          >
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
