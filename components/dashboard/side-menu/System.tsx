"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  ChevronDown,
  User,
  Shield,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const menu = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    icon: BarChart3,
    children: [
      { title: "Overview", href: "#" },
      { title: "Reports", href: "#" },
    ],
  },
];

export default function System() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col  bg-white rounded-xl shadow p-4">
      {/* Logo */}
      <div className="mb-6  font-bold">
        <span>SYSTEM</span>
      </div>

      <nav className="space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;

          // 🔹 Normal item
          if (!item.children) {
            const active = pathname === item.href;

            return (
              <Link
                key={item.title}
                href={item.href!}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition cursor-pointer
                  ${
                    active
                      ? "bg-secondary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                <Icon className="h-4 w-4 text-primary" />
                {item.title}
              </Link>
            );
          }

          // 🔹 Collapsible item
          const isChildActive = item.children.some((c) =>
            pathname.startsWith(c.href)
          );

          return (
            <Collapsible key={item.title} defaultOpen={isChildActive}>
              <CollapsibleTrigger
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition
                  ${
                    isChildActive
                      ? "bg-muted"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-primary" />
                  {item.title}
                </span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-1 space-y-1 pl-9">
                {item.children.map((child) => {
                  const active = pathname === child.href;
                  // const ChildIcon = child;

                  return (
                    <Link
                      key={child.title}
                      href={child.href}
                      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition
                        ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                    >
                      {/* {ChildIcon && (
                        <ChildIcon className="h-3.5 w-3.5" />
                      )} */}
                      {child.title}
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>
    </div>
  );
}
