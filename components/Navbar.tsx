// components/navbar/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Plus,
  MessageCircle,
  Users,
  Bell,
  ChevronDown,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">

          {/* ========== LEFT: Logo ========== */}
          <div className="flex-1">
            <Link href="/" className="text-xl font-bold text-primary">
              SocialApp
            </Link>
          </div>

          {/* ========== CENTER: Search (md+) ========== */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative  w-full ">
              <Input
                placeholder="Search..."
                className="w-full h-10 sm:h-10 pl-4 pr-10"
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* ========== RIGHT: Icons & Profile ========== */}
          <div className="flex-1 flex justify-end items-center gap-3">

            <Button size="icon" variant="ghost">
              <Plus className="h-5 w-5" />
            </Button>

            <Button size="icon" variant="ghost">
              <MessageCircle className="h-5 w-5" />
            </Button>

            <Button size="icon" variant="ghost">
              <Users className="h-5 w-5" />
            </Button>

            <Button size="icon" variant="ghost">
              <Bell className="h-5 w-5" />
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback>SR</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="font-medium">Demo Admin</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin Panel</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </div>
    </nav>
  );
}
