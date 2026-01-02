"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* 🔹 Import from data file */
import { dashboardData, colors } from "@/coustomarData";

export default function DashboardChart() {
  const [selected, setSelected] = useState<keyof typeof dashboardData>("Users");
  const data = dashboardData[selected];
  const color = colors[selected];

  const types = Object.keys(dashboardData) as (keyof typeof dashboardData)[];

  return (
    <div className="relative rounded-xl bg-white shadow-md p-4 w-full">
      
      {/* 🔹 Top Right Menu */}
      <div className="absolute right-4 top-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-md p-1 text-muted-foreground hover:text-foreground">
              <Menu className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="border-none bg-transparent shadow-none"
          >
            <DropdownMenuItem className="cursor-pointer text-sm text-muted-foreground focus:bg-transparent">
              View details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 🔹 Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" barSize={20} radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🔹 Horizontal List Below Chart */}
      <div className="flex justify-center gap-6 mt-4 flex-wrap">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setSelected(type)}
            className={`flex items-center gap-2 text-sm font-medium transition
              ${selected === type ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
          >
            {/* small colored dot */}
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors[type] }}
            />
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}
