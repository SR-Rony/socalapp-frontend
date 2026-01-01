// components/navbar/Navbar.tsx
"use client";

import Link from "next/link";
import { FaFacebookF,FaYoutube } from "react-icons/fa";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const menuItems = [
  { name: "Fetur", href: "/" },
  { name: "Pricing", href: "/explore" },
  { name: "Demo", href: "/messages" },
  { name: "Docs", href: "/profile" },
  { name: "Block", href: "/profile" },
  { name: "Contact", href: "/profile" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-white dark:bg-background py-1.5 shadow-sm sticky top-0 z-50">
      <div className="mx-auto container-fluid px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* ================= Left Side ================= */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-primary">
              SocialApp
            </Link>

            {/* Social Icons */}
            <div className="hidden sm:flex items-center gap-3 text-muted-foreground">
              <div className="w-10 h-10 bg-secondary rounded-full flex justify-center items-center"><FaFacebookF className="h-5 w-5 cursor-pointer text-primary transition" /></div>
              <div className="w-10 h-10 bg-secondary rounded-full flex justify-center items-center"><FaYoutube className="h-5 w-5 cursor-pointer text-primary transition" /></div>
            </div>
          </div>

          {/* ================= Right Side (Desktop) ================= */}
          <div className="hidden md:flex items-center gap-10">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-medium hover:text-primary transition"
              >
                {item.name}
              </Link>
            ))}

            <Button className="p-5">Buy</Button>
          </div>

          {/* ================= Mobile Menu Button ================= */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* ================= Mobile Menu ================= */}
        {open && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className=" px-2 py-2 text-sm font-medium hover:bg-primary"
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <Button className="mt-2 w-full font-bold ">Buy</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
