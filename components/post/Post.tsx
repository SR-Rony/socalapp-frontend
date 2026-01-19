"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import Image from "next/image";

export type PostData = {
  user: {
    name: string;
    avatar: string;
  };
  time: string;
  content: string;
  media?: string;
  mediaType?: "image" | "video";
};

export default function Post({
  user,
  time,
  content,
  media,
  mediaType = "image",
}: PostData) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      {/* User */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm">{user.name}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm mb-3">{content}</p>

      {/* Image */}
      {media && mediaType === "image" && (
        <div className="relative w-full h-[420px] mb-3 rounded-lg overflow-hidden">
          <Image
            src={media}
            alt="Post image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
            priority={false}
          />
        </div>
      )}

      {/* Video */}
      {media && mediaType === "video" && (
        <div className="relative w-full aspect-video mb-3 rounded-lg overflow-hidden">
          <video
            src={media}
            controls
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between text-muted-foreground text-sm">
        <button className="flex gap-1 hover:text-red-500">
          <Heart size={18} /> Like
        </button>
        <button className="flex gap-1 hover:text-blue-500">
          <MessageSquare size={18} /> Comment
        </button>
        <button className="flex gap-1 hover:text-green-500">
          <Share2 size={18} /> Share
        </button>
      </div>
    </div>
  );
}
