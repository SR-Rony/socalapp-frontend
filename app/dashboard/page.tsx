"use client";

import DashboardChart from "@/components/dashboard/coustomarChart";
import InfoCards from "@/components/dashboard/projectinfo/InfoCards";
import { useAppSelector } from "@/redux/hook/hook";

const Page = () => {
  const { user, token, isAuthenticated } = useAppSelector(
    (state: any) => state.auth
  );

  console.log("Redux Auth State:", {
    user,
    token,
    isAuthenticated,
  });

  return (
    <div>
      <main>
        <DashboardChart />
        <InfoCards />
      </main>
    </div>
  );
};

export default Page;
