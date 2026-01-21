"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import DashboardChart from "@/components/dashboard/coustomarChart";
import InfoCards from "@/components/dashboard/projectinfo/InfoCards";
import { useAppSelector } from "@/redux/hook/hook";

const DashboardPage = () => {
  const router = useRouter();

  const { isAuthenticated, initialized, user } = useAppSelector(
    (state: any) => state.auth
  );

  useEffect(() => {
    // wait until Redux hydration completes
    if (!initialized) return;

    // 1️⃣ Not logged in
    if (!isAuthenticated) {
      toast.error("Please log in to continue.");
      router.replace("/login");
      return;
    }

    // 2️⃣ Logged in but not admin
    if (user?.role !== "ADMIN") {
      toast.error("You are not authorized to access this page.");
      router.replace("/login");
      return;
    }
  }, [initialized, isAuthenticated, user, router]);

  // ⛔ Prevent flicker
  if (!initialized || !isAuthenticated || user?.role !== "ADMIN") return null;

  return (
    <div className="bg-white p-4 rounded-xl">
      <main>
        <DashboardChart />
        <InfoCards />
      </main>
    </div>
  );
};

export default DashboardPage;
