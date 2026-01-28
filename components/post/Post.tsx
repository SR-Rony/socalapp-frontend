"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";


export type PostData = {
  id: string;

  user: {
    name: string;
    avatar: string;
  };

  time: string;
  content: string;

  media?: string;
  mediaType?: "image" | "video";

  // 🔥 interactive states
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  shareCount: number;
};


export default function Post({
  id,
  user,
  time,
  content,
  media,
  mediaType = "image",
  isLiked,
  likeCount,
  commentCount,
  shareCount,
}: PostData) {
  // 🔥 local UI state (optimistic)
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likeCount);
  const [comments] = useState(commentCount);
  const [shares, setShares] = useState(shareCount);

  // ❤️ Like handler
  const handleLike = async () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));

    try {
      // TODO: backend call
      // await api.post(`/posts/${id}/like`);
    } catch (err) {
      // rollback if failed
      setLiked(isLiked);
      setLikes(likeCount);
    }
  };

  // 💬 Comment handler
  const handleComment = () => {
    // production: open comment modal / route
    console.log("Open comments for post:", id);
  };

  // 🔁 Share handler
  const handleShare = async () => {
    setShares((prev) => prev + 1);

    try {
      // TODO: backend call
      // await api.post(`/posts/${id}/share`);
    } catch (err) {
      setShares(shareCount);
    }
  };

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
      <p className="text-sm mb-3 whitespace-pre-line">{content}</p>

      {/* Image */}
      {media && mediaType === "image" && (
        <div className="relative w-full h-[420px] mb-3 rounded-lg overflow-hidden">
          <Image
            src={media}
            alt="Post image"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Video */}
      {media && mediaType === "video" && (
        <div className="relative w-full aspect-video mb-3 rounded-lg overflow-hidden">
          <video src={media} controls className="w-full h-full" />
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between text-sm pt-2 border-t">
        <button
          onClick={handleLike}
          className={clsx(
            "flex items-center gap-1 transition",
            liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
          )}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
          {likes}
        </button>

        <button
          onClick={handleComment}
          className="flex items-center gap-1 text-muted-foreground hover:text-blue-500"
        >
          <MessageSquare size={18} />
          {comments}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-muted-foreground hover:text-green-500"
        >
          <Share2 size={18} />
          {shares}
        </button>
      </div>
    </div>
  );
}
