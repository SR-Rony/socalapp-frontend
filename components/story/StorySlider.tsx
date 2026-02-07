"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import api from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import StoryComposer from "./StoryComposer";

/* ======================
   Types (Backend aligned)
====================== */
type StoryFeedItem = {
  ownerId: string;
  count: number;
  isSeen: boolean;
  isMe: boolean;
  owner: {
    _id: string;
    name: string;
    avatar?: string;
  };
  lastStory: {
    _id: string;
    type: "image" | "video" | "text";
    media?: {
      url: string;
    };
    text?: string;
    createdAt: string;
  };
};

export default function StorySlider() {
  const [stories, setStories] = useState<StoryFeedItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  /* ======================
     Fetch story feed
  ====================== */
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await api.get("/stories/feed");
        console.log('story',res.data);
        
        setStories(res.data.items || []);
      } catch (err) {
        console.error("Story feed error", err);
      }
    };

    fetchStories();
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full rounded-xl bg-white p-4 shadow-sm mb-4">

      {/* LEFT */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-background p-2 shadow md:flex"
      >
        <ChevronLeft size={20} />
      </button>

      {/* STORY LIST */}
      <div ref={scrollRef} className="flex gap-3 overflow-x-hidden px-8 py-2">

        {/* CREATE STORY */}
        <div className="relative h-48 w-28 flex-shrink-0 rounded-xl bg-muted shadow">
          <div className="h-32 rounded-t-xl bg-gray-200" />
          {/* <button className="absolute left-1/2 top-28 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-white">
            <Plus size={18} />
          </button> */}
          <button onClick={() => setOpen(true)}
            className="absolute left-1/2 top-28 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-white">
            <Plus />
          </button>
          <p className="mt-6 text-center text-sm font-medium">
            Create Story
          </p>
        </div>

        <StoryComposer
        open={open}
        onClose={() => setOpen(false)}
      />

        {/* STORIES */}
        {stories.map((item) => {
          const image =
            item.lastStory.type !== "text"
              ? item.lastStory.media?.url
              : undefined;

          return (
            <div
              key={item.ownerId}
              className={`relative h-48 w-28 flex-shrink-0 overflow-hidden rounded-xl shadow
              ${item.isSeen ? "ring-2 ring-gray-300" : "ring-2 ring-primary"}
              `}
            >
              {/* STORY IMAGE */}
              {image ? (
                <Image
                  src={image}
                  alt={item.owner.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-2 text-xs font-semibold text-white">
                  {item.lastStory.text}
                </div>
              )}

              {/* overlay */}
              <div className="absolute inset-0 bg-black/20" />

              {/* AVATAR */}
              <Avatar className="absolute left-2 top-2 h-8 w-8 border-2 border-primary">
                <AvatarImage src={item.owner.avatar} />
                <AvatarFallback>
                  {item.owner.name?.[0]}
                </AvatarFallback>
              </Avatar>

              {/* NAME */}
              <p className="absolute bottom-2 left-2 right-2 truncate text-xs font-semibold text-white">
                {item.isMe ? "Your Story" : item.owner.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* RIGHT */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-background p-2 shadow md:flex"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
