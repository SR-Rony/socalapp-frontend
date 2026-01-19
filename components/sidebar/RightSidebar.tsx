"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Slider from "./Slider";
import { Button } from "../ui/button";

type RightSidebarProps = {
  friendsOnline?: { name: string; avatar: string }[];
  suggestedPages?: { name: string; avatar: string }[];
};

export default function RightSidebar({
  friendsOnline = [],
  suggestedPages = [],
}: RightSidebarProps) {

  // 🔹 Demo Ads Slider Items
  const adsItems = [
    { id: 1, title: "Laptop Pro", image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 2, title: "Smart Watch", image: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 3, title: "Headphones", image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 4, title: "Gaming Chair", image: "https://plus.unsplash.com/premium_photo-1672116453187-3aa64afe04ad?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 5, title: "Camera Lens", image: "https://images.unsplash.com/photo-1579781354199-1ffd36bd7d30?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-full space-y-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">

      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-center">You have 5 merits left</CardTitle>
        </CardHeader>
        <CardContent className=" text-center">
          <Button>Send Merite</Button>
        </CardContent>
      </Card>

      {/* Sponsored / Ads Section */}
      <Card className="bg-[#5603AD] text-white">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Promoted Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Slider items={adsItems} visibleItems={3} />
        </CardContent>
      </Card>

      {/* Friends Online */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Friends Online</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {friendsOnline.map((friend) => (
            <div
              key={friend.name}
              className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-md cursor-pointer"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={friend.avatar} />
                <AvatarFallback>{friend.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{friend.name}</span>
              <span className="ml-auto h-2 w-2 bg-green-500 rounded-full"></span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggested Pages */}
      <Card className="bg-primary text-white">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Promoted Pages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Slider items={adsItems} visibleItems={3} />
        </CardContent>
      </Card>
    </aside>
  );
}
