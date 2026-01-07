import DashboardChart from "@/components/dashboard/coustomarChart";
import InfoCards from "@/components/dashboard/projectinfo/InfoCards";

const page = () => {
  return (
    <div>
      <main>
        <DashboardChart/>
        <InfoCards/>
      </main>
    </div>
  );
};

export default page;
