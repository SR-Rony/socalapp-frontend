import CoustomarChart from "@/components/dashboard/coustomarChart";

const page = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 bg-gray-300 py-2">
        Dashboard Overview
      </h1>

      <main>
        <CoustomarChart/>
      </main>
    </div>
  );
};

export default page;
