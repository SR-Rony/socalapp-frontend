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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import Sidebar from "@/components/sidebar/Sidebar";

import { useAppSelector, useAppDispatch } from "@/redux/hook/hook";
import { logout } from "@/redux/features/authSlice";
import { toast } from "sonner";

export default function Navbar() {
  const { user } = useAppSelector((state: any) => state.auth);
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
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-2">

          {/* =============================
              LEFT: Mobile Menu + Logo
          ============================= */}
          <div className="flex items-center gap-2 flex-1">

            {/* 🔥 Mobile Sidebar Trigger */}
            <div className="md:hidden">
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
          <div className="flex flex-1 justify-end items-center gap-2">
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
                  <AvatarImage src={user?.avatar || "/avatar.png"} />
                  <AvatarFallback>{userName}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuItem className="font-semibold cursor-default">
                  {userName}
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="text-indigo-600 font-medium">
                  Upgrade to Pro
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="flex justify-between">
                  <span>Points</span>
                  <span className="font-medium">5</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="flex justify-between">
                  <span>Wallet</span>
                  <span className="font-medium">$2,386.96</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/support">Support Center</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Admin Panel</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  Keyboard Shortcuts
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={handleLogout}
                >
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
