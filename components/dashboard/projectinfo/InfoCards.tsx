import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Eye,
  FileText,
  Layers,
  CalendarDays,
  MessageSquare,
  Bell,
} from "lucide-react";

const stats = [
  {
    title: "Online Users",
    value: "1,245",
    icon: Users,
    gradient: "bg-[linear-gradient(90deg,#0f766e,#14b8a6)]",
  },
  {
    title: "Active Users",
    value: "980",
    icon: UserCheck,
    gradient: "bg-[linear-gradient(90deg,#1e3a8a,#2563eb)]",
  },
  {
    title: "Pending Users",
    value: "120",
    icon: Clock,
    gradient: "bg-[linear-gradient(90deg,#92400e,#f59e0b)]",
  },
  {
    title: "Offline Users",
    value: "245",
    icon: UserX,
    gradient: "bg-[linear-gradient(90deg,#7f1d1d,#ef4444)]",
  },
  {
    title: "Total Visitors",
    value: "45,780",
    icon: Eye,
    gradient: "bg-[linear-gradient(90deg,#312e81,#6366f1)]",
  },
  {
    title: "Pages",
    value: "120",
    icon: FileText,
    gradient: "bg-[linear-gradient(90deg,#075985,#0284c7)]",
  },
  {
    title: "Groups",
    value: "32",
    icon: Layers,
    gradient: "bg-[linear-gradient(90deg,#14532d,#22c55e)]",
  },
  {
    title: "Events",
    value: "14",
    icon: CalendarDays,
    gradient: "bg-[linear-gradient(90deg,#701a75,#db2777)]",
  },
  {
    title: "Messages",
    value: "1,540",
    icon: MessageSquare,
    gradient: "bg-[linear-gradient(90deg,#3730a3,#7c3aed)]",
  },
  {
    title: "Notifications",
    value: "86",
    icon: Bell,
    gradient: "bg-[linear-gradient(90deg,#78350f,#fbbf24)]",
  },
];

export default function DashboardInfoCards() {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-center mb-7">Project Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div key={index} className="group relative">
              {/* subtle glow */}
              <div
                className={`absolute inset-0 rounded-2xl ${item.gradient} blur-xl opacity-30`}
              />

              {/* card */}
              <div
                className={`relative overflow-hidden rounded-2xl p-6 text-white
                ${item.gradient}
                transition-all duration-300
                group-hover:-translate-y-1 group-hover:shadow-2xl`}
              >
                {/* soft overlay */}
                <div className="absolute inset-0 bg-black/10" />

                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">{item.title}</p>
                    <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                      {item.value}
                    </h2>
                  </div>

                  {/* icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                {/* left light */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-1/3 bg-white/10" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
