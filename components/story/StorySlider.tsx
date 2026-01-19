"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

/* ======================
   Types
====================== */
type Story = {
  id: number;
  name: string;
  image: string;
  avatar: string;
};

/* ======================
   Demo Data
====================== */
const storyData: Story[] = [
  { id: 1, name: "Rony", image: "https://picsum.photos/300/500?1", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Hasan", image: "https://picsum.photos/300/500?2", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Rahim", image: "https://picsum.photos/300/500?3", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Karim", image: "https://picsum.photos/300/500?4", avatar: "https://i.pravatar.cc/150?img=4" },
  { id: 5, name: "Sabbir", image: "https://picsum.photos/300/500?5", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 6, name: "Rahim", image: "https://picsum.photos/300/500?6", avatar: "https://i.pravatar.cc/150?img=6" },
  { id: 7, name: "Karim", image: "https://picsum.photos/300/500?7", avatar: "https://i.pravatar.cc/150?img=7" },
  { id: 8, name: "Sabbir", image: "https://picsum.photos/300/500?8", avatar: "https://i.pravatar.cc/150?img=8" },
];

export default function StorySlider() {
  const [stories, setStories] = useState<Story[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStories(storyData);
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full bg-white rounded-xl shadow-sm p-4 mb-4 ">

      {/* LEFT ARROW */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-background p-2 shadow-md hover:bg-muted md:flex"
      >
        <ChevronLeft size={20} />
      </button>

      {/* STORY LIST */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-hidden px-8 py-2"
      >
        {/* CREATE STORY */}
        <div className="relative h-48 w-28 flex-shrink-0 rounded-xl bg-background shadow-sm">
          <div className="h-32 rounded-t-xl bg-muted" />
          <button className="absolute left-1/2 top-28 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-white">
            <Plus size={18} />
          </button>
          <p className="mt-6 text-center text-sm font-medium">
            Create Story
          </p>
        </div>

        {/* STORIES */}
        {stories.map((story) => (
          <div
            key={story.id}
            className="relative h-48 w-28 flex-shrink-0 overflow-hidden rounded-xl shadow-sm"
          >
            <Image
              src={story.image}
              alt={story.name}
              fill
              sizes="112px"
              className="object-cover"
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-black/20" />

            <Avatar className="absolute left-2 top-2 h-8 w-8 border-2 border-primary">
              <AvatarImage src={story.avatar} />
              <AvatarFallback>{story.name[0]}</AvatarFallback>
            </Avatar>

            <p className="absolute bottom-2 left-2 right-2 truncate text-xs font-semibold text-white">
              {story.name}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT ARROW */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-background p-2 shadow-md hover:bg-muted md:flex"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
