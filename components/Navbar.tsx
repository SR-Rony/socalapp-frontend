"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  UserPlus,
  Users,
  Bell,
  ChevronDown,
  CirclePlus,
  Menu,
  LogOut,
  Keyboard,
  LayoutDashboard,
  Settings,
  LifeBuoy,
  Wallet,
  Star,
  Crown,
  User,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import Sidebar from "@/components/sidebar/Sidebar";

import { useAppSelector, useAppDispatch } from "@/redux/hook/hook";
import { logout } from "@/redux/features/authSlice";
import { toast } from "sonner";
import { SignedImage } from "./common/SignedImage";

// ✅ Type definition for user
type UserType = {
  _id: string;
  name: string;
  role?: string;
  avatar?: {
    key?: string;
    url?: string;
    provider?: string;
  };
};

export default function Navbar() {
  const { user } = useAppSelector((state) => state.auth) as { user: UserType | null };
  
  const dispatch = useAppDispatch();
  const router = useRouter();

  // =============================
  // Safe username (first 2 words)
  // =============================
  const userName =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .join(" ") || "User";

  // =============================
  // Logout Handler
  // =============================
  const handleLogout = () => {
    dispatch(logout());
    toast.success("You’re logged out. See you again soon!");
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white dark:bg-background">
      <div className="container mx-auto px-5">
        <div className="flex h-16 items-center gap-2">

          {/* =============================
              LEFT: Mobile Menu + Logo
          ============================= */}
          <div className="flex items-center gap-2 flex-1">

            {/* 🔥 Mobile Sidebar Trigger */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="left" className="w-72 p-0">
                  <div className="flex h-full flex-col">
                    <div className="border-b px-4 py-3 font-bold">
                      SocialApp
                    </div>

                    <div className="flex-1 overflow-y-auto px-2">
                      <Sidebar />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-primary">
              SocialApp
            </Link>
          </div>

          {/* =============================
              CENTER: Search (Desktop only)
          ============================= */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-full max-w-md">
              <Input
                placeholder="Search..."
                className="h-10 pl-4 pr-10"
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* =============================
              RIGHT: Actions + Profile
          ============================= */}
          <div className="flex flex-1 justify-end items-center md:gap-2">
            <Button size="icon" variant="ghost">
              <CirclePlus className="h-7 w-7" />
            </Button>

            <Button size="icon" variant="ghost">
              <UserPlus className="h-5 w-5" />
            </Button>

            <Button size="icon" variant="ghost">
              <Users className="h-5 w-5" />
            </Button>

            <Button size="icon" variant="ghost">
              <Bell className="h-5 w-5" />
            </Button>

            {/* =============================
                Profile Dropdown
            ============================= */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 outline-none">
                <Avatar className="h-9 w-9">
                  {user?.avatar?.url ? (
                    <SignedImage
                      url={user.avatar.url ? `${user.avatar.url}?t=${Date.now()}` : undefined} // cache-busting
                      keyPath={user.avatar.key}
                      provider={user.avatar.provider}
                      alt="profile"
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <AvatarFallback>
                      {user?.name
                        ?.split(" ")
                        .map((w: string) => w[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64">
                {/* User name */}
                <DropdownMenuItem className="font-semibold cursor-default flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {userName}
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href={user?._id ? `/profile/${user._id}` : "/login"}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="text-indigo-600 font-medium flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Upgrade to Pro
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    Points
                  </span>
                  <span className="font-medium">5</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    Wallet
                  </span>
                  <span className="font-medium">$2,386.96</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/support" className="flex items-center gap-2">
                    <LifeBuoy className="h-4 w-4" />
                    Support Center
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>

                {user?.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem className="flex items-center gap-2">
                  <Keyboard className="h-4 w-4" />
                  Keyboard Shortcuts
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500 flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>

        </div>
      </div>
    </nav>
  );
}
