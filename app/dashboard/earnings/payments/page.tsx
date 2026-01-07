"use client";

import React from "react";
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import DashboardChart from "@/components/dashboard/coustomarChart";
import PaymentsTable from "@/components/dashboard/PaymentsTable";

/* ===============================
   Small reusable card component
================================ */
const PaymentCard = ({
  title,
  amount,
  icon: Icon,
  gradient,
}: any) => {
  return (
    <div
      className={`rounded-xl p-5 text-white shadow-md ${gradient}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <h2 className="text-2xl font-bold mt-1">{amount}</h2>
        </div>

        <div className="p-3 rounded-full bg-white/20">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const page = () => {
  return (
    <div className="space-y-6">

      {/* ================= Charts ================= */}
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 md:col-span-6">
          <DashboardChart />
        </div>
        <div className="col-span-12 md:col-span-6">
          <DashboardChart />
        </div>
      </div>

      {/* ================= Payment Summary ================= */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <PaymentCard
            title="Total PayIn"
            amount="$14,755,468.09"
            icon={DollarSign}
            gradient="bg-gradient-to-r from-indigo-500 to-purple-600"
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <PaymentCard
            title="This Month PayIn"
            amount="$3,555.99"
            icon={TrendingUp}
            gradient="bg-gradient-to-r from-emerald-500 to-teal-600"
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <PaymentCard
            title="Total Pending PayOut"
            amount="$1,396.00"
            icon={Clock}
            gradient="bg-gradient-to-r from-orange-500 to-red-500"
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <PaymentCard
            title="This Month Pending PayOut"
            amount="$50.00"
            icon={Clock}
            gradient="bg-gradient-to-r from-yellow-500 to-amber-600"
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <PaymentCard
            title="Total Approved PayOut"
            amount="$0.00"
            icon={CheckCircle}
            gradient="bg-gradient-to-r from-sky-500 to-blue-600"
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <PaymentCard
            title="This Month Approved PayOut"
            amount="$0.00"
            icon={CheckCircle}
            gradient="bg-gradient-to-r from-cyan-500 to-indigo-600"
          />
        </div>
      </div>

      {/* ================= Payments Table ================= */}
      <PaymentsTable />

    </div>
  );
};

export default page;
