"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
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

type MenuChild = {
  title: string;
  href: string;
  icon?: any;
};

type MenuItem = {
  title: string;
  icon: any;
  href?: string;
  children?: MenuChild[];
};

const menu: MenuItem[] = [
  {
    title: "Earnings",
    icon: BarChart3,
    children: [
      { title: "Payments", href: "/dashboard/earnings/payments" },
    ],
  },
  {
    title: "Ads",
    icon: BarChart3,
    children: [
      { title: "Ads Settings", href: "/dashboard/ads/ads_settings" },
      { title: "Lists User Ads", href: "/dashboard/ads/user_ads" },
    ],
  },
  {
    title: "Wallet",
    icon: BarChart3,
    children: [
      { title: "Wallet Settings", href: "/dashboard/wallet/setting" },
      { title: "Lists User Ads", href: "/dashboard/ads/user_ads" },
    ],
  },
  {
    title: "Affiliates",
    icon: BarChart3,
    children: [
      { title: "Affiliates Settings", href: "/dashboard/affiliates/setting" },
      { title: "Payments", href: "/dashboard/affiliates/payments" },
    ],
  },
  {
    title: "Marketplace",
    icon: Users,
    children: [
      { title: "Market Settings", href: "/dashboard/market/setting" },
    ],
  },
  {
    title: "Monietization",
    icon: Users,
    children: [
      { title: "Monietization Settings", href: "/dashboard/monietization/setting" },
      { title: "Payments Request", href: "/dashboard/monietization/payment" },
    ],
  },
  {
    title: "Points System",
    icon: Settings,
    children: [
      {
        title: "Points Settings",
        href: "/dashboard/points/setting",
        icon: User,
      },
      {
        title: "Payments Requests",
        href: "/dashboard/points/payments",
        icon: Shield,
      },
    ],
  },
];

export default function Money() {
  const pathname = usePathname();

  // 🔹 Type Guard
  const isNormalItem = (item: MenuItem): item is MenuItem & { href: string } =>
    !!item.href && !item.children;

  return (
    <div className="flex h-full flex-col bg-white rounded-xl shadow p-4 mt-5">
      <div className="mb-6 font-bold">
        <span>MONEY</span>
      </div>

      <nav className="space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;

          // 🔹 Normal item (no children) & href exists
          if (isNormalItem(item)) {
            const active = pathname === item.href;

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition
                  ${
                    active
                      ? "bg-secondary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                <Icon className="h-4 w-4 text-[#10897E]" />
                {item.title}
              </Link>
            );
          }

          // 🔹 Collapsible item
          const isChildActive = item.children?.some((c) =>
            pathname.startsWith(c.href)
          );

          return (
            <Collapsible key={item.title} defaultOpen={!!isChildActive}>
              <CollapsibleTrigger
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition
                  ${
                    isChildActive
                      ? "bg-muted"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-[#10897E]" />
                  {item.title}
                </span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-1 space-y-1 pl-9">
                {item.children?.map((child) => (
                  <Link
                    key={child.title}
                    href={child.href}
                    className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition
                      ${
                        pathname === child.href
                          ? "bg-secondary"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                  >
                    {child.title}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>
    </div>
  );
}
