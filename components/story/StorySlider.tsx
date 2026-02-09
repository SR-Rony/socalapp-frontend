"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import { Avatar } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import StoryComposer from "./StoryComposer";
import { useAppSelector, useAppDispatch } from "@/redux/hook/hook";
import { setStories } from "@/redux/features/storySlice";
import { SignedImage } from "../common/SignedImage";
import StoryViewer from "./StoryViewer";

// ======================
// Types
// ======================
type MediaType = {
  url: string;
  key?: string;
  provider?: string;
};

type Story = {
  _id: string;
  type: "image" | "video" | "text";
  text?: string;
  media?: MediaType;
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
  isSeen: boolean;
  isMe: boolean;
  owner: {
    _id: string;
    name: string;
    avatar?: UserAvatar;
  };
  lastStory: Story;
  stories?: Story[]; // 👈 future ready
};

type UserType = {
  _id: string;
  name: string;
  avatar?: {
    key?: string;
    url?: string;
    provider?: string;
  };
};

export default function StorySlider() {
  const { user } = useAppSelector(
    (state) => state.auth
  ) as { user: UserType | null };

  const dispatch = useAppDispatch();

  const stories = useAppSelector(
    (state) => state.story?.stories ?? []
  ) as StoryFeedItem[];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // ✅ STORY VIEWER STATE
  const [viewer, setViewer] = useState<{
    userIndex: number;
    storyIndex: number;
  } | null>(null);

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
    <div className="relative mb-4 w-full rounded-xl bg-white p-4 shadow-sm">
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
          <div className="h-32 overflow-hidden rounded-t-xl bg-gray-200">
            {user?.avatar?.url ? (
              <SignedImage
                url={user.avatar.url}
                keyPath={user.avatar.key}
                provider={user.avatar.provider}
                alt="profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-300 text-white font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <button
            onClick={() => setOpen(true)}
            className="absolute left-1/2 top-28 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-white"
          >
            <Plus />
          </button>

          <p className="mt-6 text-center text-sm font-medium">
            Create Story
          </p>
        </div>

        <StoryComposer open={open} onClose={() => setOpen(false)} />

        {/* STORIES */}
        {stories.map((item, index) => {
          if (!item.lastStory) return null;

          const media =
            item.lastStory.type !== "text"
              ? item.lastStory.media
              : null;

          return (
            <div
              key={item._id}
              onClick={() =>
                setViewer({ userIndex: index, storyIndex: 0 })
              }
              className={`relative h-48 w-28 cursor-pointer flex-shrink-0 overflow-hidden rounded-xl shadow ${
                item.isSeen
                  ? "ring-2 ring-gray-300"
                  : "ring-2 ring-primary"
              }`}
            >
              {media ? (
                <SignedImage
                  keyPath={media.key}
                  url={media.url}
                  provider={media.provider}
                  alt="story"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-2 text-xs font-semibold text-white">
                  {item.lastStory.text}
                </div>
              )}

              <div className="absolute inset-0 bg-black/20" />

              <Avatar className="absolute left-2 top-2 h-8 w-8 border-2 border-primary">
                {item.owner.avatar && (
                  <SignedImage
                    keyPath={item.owner.avatar.key}
                    url={item.owner.avatar.url}
                    provider={item.owner.avatar.provider}
                    alt="avatar"
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

      {/* STORY VIEWER */}
      {viewer && (
        <StoryViewer
          stories={stories}
          userIndex={viewer.userIndex}
          storyIndex={viewer.storyIndex}
          onClose={() => setViewer(null)}
          onChange={(u, s) =>
            setViewer({ userIndex: u, storyIndex: s })
          }
        />
      )}

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
