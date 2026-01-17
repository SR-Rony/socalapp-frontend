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

import { useAppSelector, useAppDispatch } from "@/redux/hook/hook";
import { logout } from "@/redux/features/authSlice";

export default function Navbar() {
  const { user } = useAppSelector((state: any) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  console.log("user",user);
  

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
    router.push("/login"); // or "/"
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">

          {/* LEFT: Logo */}
          <div className="flex-1">
            <Link href="/" className="text-xl font-bold text-primary">
              SocialApp
            </Link>
          </div>

          {/* CENTER: Search */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-full max-w-md">
              <Input
                placeholder="Search..."
                className="h-10 pl-4 pr-10"
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex-1 flex justify-end items-center gap-2">
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
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
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

                  <Link href="/profile">
                    <DropdownMenuItem>
                      Profile
                    </DropdownMenuItem>
                  </Link>

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

                  <Link href="/dashboard">
                    <DropdownMenuItem asChild>
                      Admin Panel
                    </DropdownMenuItem>
                  </Link>

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
