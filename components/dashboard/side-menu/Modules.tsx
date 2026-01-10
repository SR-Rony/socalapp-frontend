"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BookText,
  Users,
  Settings,
  ChevronDown,
  User,
  Shield,
  LucideIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

/* ===============================
   Types (IMPORTANT)
================================ */
type MenuChild = {
  title: string;
  href: string;
  icon?: LucideIcon;
};

type MenuItem = {
  title: string;
  icon: LucideIcon;
  children: MenuChild[];
};

/* ===============================
   Menu Data
================================ */
const menu: MenuItem[] = [
  {
    title: "Posts",
    icon: BookText,
    children: [
      {
        title: "List Posts",
        href: "/dashboard/posts/list",
        icon: User,
      },
    ],
  },
  {
    title: "Groups",
    icon: Users,
    children: [
      {
        title: "List Groups",
        href: "/dashboard/user_groups",
        icon: User,
      },
      // {
      //   title: "List Categories",
      //   href: "/dashboard/groups/categories",
      //   icon: Shield,
      // },
    ],
  },
];

export default function Module() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white rounded-xl shadow p-4 mt-5">
      {/* Header */}
      <div className="mb-6 font-bold text-sm">Modules</div>

      <nav className="space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;

          // 🔹 check any child active
          const isChildActive = item.children.some((child) =>
            pathname.startsWith(child.href)
          );

          return (
            <Collapsible key={item.title} defaultOpen={isChildActive}>
              {/* Parent */}
              <CollapsibleTrigger
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition
                  ${
                    isChildActive
                      ? "bg-secondary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-red-500" />
                  {item.title}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isChildActive ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>

              {/* Children */}
              <CollapsibleContent className="mt-1 space-y-1 pl-9">
                {item.children.map((child) => {
                  const active = pathname === child.href;
                  const ChildIcon = child.icon;

                  return (
                    <Link
                      key={child.title}
                      href={child.href}
                      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition
                        ${
                          active
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                    >
                      {ChildIcon && (
                        <ChildIcon className="h-3.5 w-3.5" />
                      )}
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
