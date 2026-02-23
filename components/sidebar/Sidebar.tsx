"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Clock,
  Flame,
  Compass,
  User,
  FileText,
  Package,
  Wallet,
  Megaphone,
  Briefcase,
  GraduationCap,
  Bookmark,
  Calendar,
  Image,
  TrendingUp,
  Layers,
  Users,
  Flag,
  PlayCircle,
  Video,
  ShoppingBag,
  MessageSquare,
  Film,
  Gamepad2,
  Code,
  Award,
  ChevronDown,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

/* =======================
   Types
======================= */
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

/* =======================
   Menu Config (UNCHANGED)
======================= */
const menu: MenuItem[] = [
  {
    title: "News Feed",
    icon: Home,
    children: [
      { title: "Recent Updates", href: "/recent", icon: Clock },
      { title: "Popular Posts", href: "/popular", icon: Flame },
      { title: "Discover Posts", href: "/discover", icon: Compass },
    ],
  },
  {
    title: "Mine",
    icon: User,
    children: [
      { title: "My Blogs", href: "/my/blogs", icon: FileText },
      { title: "My Products", href: "/my/products", icon: Package },
      { title: "My Funding", href: "/my/funding", icon: Wallet },
      { title: "My Offers", href: "/my/offers", icon: Megaphone },
      { title: "My Jobs", href: "/my/jobs", icon: Briefcase },
      { title: "My Courses", href: "/my/courses", icon: GraduationCap },
    ],
  },
  { title: "Saved", icon: Bookmark, href: "/saved" },
  { title: "Scheduled", icon: Calendar, href: "/scheduled" },
  { title: "Memories", icon: Image, href: "/memories" },
  { title: "Ads Manager", icon: Megaphone, href: "/ads" },
  { title: "Wallet", icon: Wallet, href: "/wallet" },
  {
    title: "Boosted",
    icon: TrendingUp,
    children: [
      { title: "Posts", href: "/ads/posts", icon: FileText },
      { title: "Pages", href: "/ads/pages", icon: Layers },
      { title: "Groups", href: "/ads/groups", icon: Users },
      { title: "Events", href: "/ads/events", icon: Flag },
    ],
  },
  { title: "People", icon: Users, href: "/people" },
  { title: "Pages", icon: Layers, href: "/pages" },
  {
    title: "Groups",
    icon: Users,
    children: [
      { title: "Groups", href: "/groups", icon: Users },
      { title: "Suggested For Groups", href: "/groups/for-you", icon: Users },
      { title: "My Groups", href: "/groups/my", icon: User },
      { title: "Create Groups", href: "/groups/create", icon: User },
    ],
  },
  { title: "Events", icon: Flag, href: "/events" },
  { title: "Reels", icon: PlayCircle, href: "/feed/videos/reels" },
  { title: "Watch", icon: Video, href: "/feed/videos/general" },
  { title: "Blogs", icon: FileText, href: "/blogs" },
  { title: "Market", icon: ShoppingBag, href: "/market" },
  { title: "Funding", icon: Wallet, href: "/funding" },
  { title: "Offers", icon: Megaphone, href: "/offers" },
  { title: "Jobs", icon: Briefcase, href: "/jobs" },
  { title: "Courses", icon: GraduationCap, href: "/courses" },
  { title: "Forums", icon: MessageSquare, href: "/forums" },
  { title: "Movies", icon: Film, href: "/movies" },
  { title: "Games", icon: Gamepad2, href: "/games" },
  { title: "Developers", icon: Code, href: "/developers" },
  { title: "Merits", icon: Award, href: "/merits" },
];

/* =======================
   Component
======================= */
export default function Sidebar() {
  const pathname = usePathname();

  const isNormalItem = (item: MenuItem): item is MenuItem & { href: string } =>
    !!item.href && !item.children;

  return (
    // 🔥 Full height + scroll enabled
    <div className="flex h-screen flex-col px-2 py-4 overflow-hidden">
      
      {/* 🔥 Scroll only menu area */}
      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        {menu.map((item) => {
          const Icon = item.icon;

          /* -------- Normal Item -------- */
          if (isNormalItem(item)) {
            const active = pathname === item.href;

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] transition
                  ${
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                <Icon className="h-5 w-5 text-primary" />
                {item.title}
              </Link>
            );
          }

          /* -------- Collapsible Item -------- */
          const isChildActive = item.children?.some((c) =>
            pathname.startsWith(c.href)
          );

          return (
            <Collapsible key={item.title} defaultOpen={!!isChildActive}>
              <CollapsibleTrigger
                className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-[15px] transition
                  ${
                    isChildActive
                      ? "bg-muted font-semibold text-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  {item.title}
                </span>

                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200
                    ${isChildActive ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-1 space-y-1 pl-6">
                {item.children?.map((child) => {
                  const ChildIcon = child.icon;
                  const active = pathname === child.href;

                  return (
                    <Link
                      key={child.title}
                      href={child.href}
                      className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition
                        ${
                          active
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                    >
                      {ChildIcon && (
                        <ChildIcon className="h-4 w-4 text-primary" />
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

