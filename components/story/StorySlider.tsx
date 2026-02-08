"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import { Avatar } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import StoryComposer from "./StoryComposer";
import { useAppSelector, useAppDispatch } from "@/redux/hook/hook";
import { setStories } from "@/redux/features/storySlice";
import { SignedImage } from "../common/SignedImage";

// ======================
// Types
// ======================
type MediaType = {
  url: string;
  key?: string;
  provider?: string;
  thumbnailUrl?: string;
};

type Story = {
  _id: string;
  userId: string;
  type: "image" | "video" | "text";
  text?: string;
  media?: MediaType;
  privacy: "public" | "friends" | "only_me";
  createdAt: string;
};

type UserAvatar = {
  url: string;
  key?: string;
  provider?: string;
};

type StoryFeedItem = {
  _id: string;
  ownerId: string;
  count: number;
  isSeen: boolean;
  isMe: boolean;
  owner: {
    _id: string;
    name: string;
    avatar?: UserAvatar;
  };
  lastStory: Story;
};

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

export default function StorySlider() {
  const { user } = useAppSelector((state) => state.auth) as { user: UserType | null };
  
  const dispatch = useAppDispatch();

  // ✅ safe selector
  const stories = useAppSelector(
    (state) => state.story?.stories ?? []
  ) as StoryFeedItem[];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // ======================
  // Fetch story feed
  // ======================
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await api.get("/stories/feed");
        if (res.data?.success) {
          dispatch(setStories(res.data.items ?? []));
        }
      } catch (err) {
        console.error("Story feed error", err);
      }
    };

    fetchStories();
  }, [dispatch]);

  // ======================
  // Scroll
  // ======================
  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
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
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto px-8 py-2">
        {/* CREATE STORY */}
        <div className="relative h-48 w-28 flex-shrink-0 rounded-xl bg-muted shadow">
          {/* PROFILE IMAGE / BACKGROUND */}
          <div className="h-32 rounded-t-xl overflow-hidden bg-gray-200">
            {user?.avatar?.url ? (
              <SignedImage
                url={user.avatar.url ? `${user.avatar.url}?t=${Date.now()}` : undefined} // cache-busting
                keyPath={user.avatar.key}
                provider={user.avatar.provider}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-300 flex items-center justify-center text-white font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          {/* PLUS BUTTON */}
          <button
            onClick={() => setOpen(true)}
            className="absolute left-1/2 top-28 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-white"
          >
            <Plus />
          </button>

          <p className="mt-6 text-center text-sm font-medium">Create Story</p>
        </div>


        <StoryComposer open={open} onClose={() => setOpen(false)} />

        {/* STORIES */}
        {stories.map((item) => {
          const avatar = item.owner.avatar;
          if (!item.lastStory) return null; // 🔒 safety

          const lastStory = item.lastStory;
          const media =  lastStory.type !== "text" ? lastStory.media : null;
          

          return (
            <div
              key={item._id}
              className={`relative h-48 w-28 flex-shrink-0 overflow-hidden rounded-xl shadow ${
                item.isSeen ? "ring-2 ring-gray-300" : "ring-2 ring-primary"
              }`}
            >
              {media ? (
                <div className="relative h-full w-full">
                  <SignedImage
                    keyPath={media.key}
                    url={media.url}
                    provider={media.provider}
                    alt="story"
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-2 text-xs font-semibold text-white">
                  {lastStory.text}
                </div>
              )}

              <div className="absolute inset-0 bg-black/20" />

              {/* AVATAR */}
              <Avatar className="absolute left-2 top-2 h-8 w-8 border-2 border-primary overflow-hidden">
                {avatar && (
                  <SignedImage
                    keyPath={avatar.key}
                    url={avatar.url}
                    provider={avatar.provider}
                    alt="avatar"
                    className="object-cover"
                  />
                )}
              </Avatar>

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
