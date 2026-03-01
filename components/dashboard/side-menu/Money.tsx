"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  Wallet,
  Megaphone,
  Users,
  Store,
  DollarSign,
  Coins,
  Settings,
  CreditCard,
  List,
  ChevronDown,
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
    icon: BarChart3, // Earnings → Chart
    children: [
      {
        title: "Payments",
        href: "/dashboard/earnings/payments",
        icon: CreditCard,
      },
    ],
  },

  {
    title: "Ads",
    icon: Megaphone, // Ads → Promotion
    children: [
      {
        title: "Ads Settings",
        href: "/dashboard/ads/ads_settings",
        icon: Settings,
      },
      {
        title: "Lists User Ads",
        href: "/dashboard/ads/user_ads",
        icon: List,
      },
    ],
  },

  {
    title: "Wallet",
    icon: Wallet, // Wallet
    children: [
      {
        title: "Wallet Settings",
        href: "/dashboard/wallet/setting",
        icon: Settings,
      },
    ],
  },

  {
    title: "Affiliates",
    icon: Users, // Affiliates → Users
    children: [
      {
        title: "Affiliates Settings",
        href: "/dashboard/affiliates/setting",
        icon: Settings,
      },
      {
        title: "Payments",
        href: "/dashboard/affiliates/payments",
        icon: DollarSign,
      },
    ],
  },

  {
    title: "Marketplace",
    icon: Store, // Marketplace → Store
    children: [
      {
        title: "Market Settings",
        href: "/dashboard/market/setting",
        icon: Settings,
      },
    ],
  },

  {
    title: "Monetization",
    icon: DollarSign, // Monetization → Money
    children: [
      {
        title: "Monetization List",
        href: "/dashboard/monietization/list",
        icon: Settings,
      },
      {
        title: "Monetization Settings",
        href: "/dashboard/monietization/setting",
        icon: Settings,
      },
    ],
  },

  {
    title: "Points System",
    icon: Coins, // Points → Coins
    children: [
      {
        title: "Points Settings",
        href: "/dashboard/points/setting",
        icon: Settings,
      },
      {
        title: "Payments Requests",
        href: "/dashboard/points/payments",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "Withdraw",
    icon: DollarSign, // Marketplace → Store
    children: [
      {
        title: "Withdraw List",
        href: "/dashboard/withdraws",
        icon: Settings,
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
                <Icon className="h-4 w-4 text-[#4CAF50]" />
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
