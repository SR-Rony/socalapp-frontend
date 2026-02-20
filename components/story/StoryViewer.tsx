"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { SignedImage } from "@/components/common/SignedImage";
import { ChevronLeft, ChevronRight } from "lucide-react";

type StoryMedia = {
  url: string;
  key?: string;
  provider?: string;
  thumbnailUrl?: string;
};

type StoryItem = {
  _id: string;
  type: "image" | "video" | "text";
  text?: string;
  media?: StoryMedia;
  createdAt: string;
};

type StoryUser = {
  owner: {
    name: string;
    avatar?: StoryMedia;
  };
  stories?: StoryItem[];
  lastStory?: StoryItem;
  isMe?: boolean;
};

type Props = {
  stories: StoryUser[];
  userIndex: number;
  storyIndex: number;
  onClose: () => void;
  onChange: (u: number, s: number) => void;
};

export default function StoryViewer({
  stories,
  userIndex,
  storyIndex,
  onClose,
  onChange,
}: Props) {
  const user = stories[userIndex];

  const userStories =
    user.stories && user.stories.length > 0
      ? user.stories
      : user.lastStory
      ? [user.lastStory]
      : [];

  const current = userStories[storyIndex];

  // 🛑 crash protection
  if (!current) return null;

  // ⏱️ fixed duration (সব story same timing)
  const duration = 7000;

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 👉 NEXT
  const next = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(0);

    if (storyIndex < userStories.length - 1) {
      onChange(userIndex, storyIndex + 1);
    } else if (userIndex < stories.length - 1) {
      onChange(userIndex + 1, 0);
    } else {
      onClose();
    }
  };

  // 👉 PREV
  const prev = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(0);

    if (storyIndex > 0) {
      onChange(userIndex, storyIndex - 1);
    } else if (userIndex > 0) {
      const prevUser = stories[userIndex - 1];

      const prevUserStories =
        prevUser.stories && prevUser.stories.length > 0
          ? prevUser.stories
          : prevUser.lastStory
          ? [prevUser.lastStory]
          : [];

      onChange(userIndex - 1, prevUserStories.length - 1);
    }
  };

  // 👉 AUTO PROGRESS
  useEffect(() => {
    if (isPaused) return;

    setProgress(0);

    if (timerRef.current) clearInterval(timerRef.current);

    const interval = 50;
    const step = 100 / (duration / interval);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          clearInterval(timerRef.current!);
          next();
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [userIndex, storyIndex, isPaused]);

  // 👉 pause handlers (hold to pause)
  const handleHoldStart = () => {
    setIsPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleHoldEnd = () => {
    setIsPaused(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative z-10 h-[90vh] w-full max-w-md"
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
      >
        {/* ⬅️ LEFT */}
        {(userIndex > 0 || storyIndex > 0) && (
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* ➡️ RIGHT */}
        {(userIndex < stories.length - 1 ||
          storyIndex < userStories.length - 1) && (
          <button
            onClick={next}
            className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* 📱 STORY CARD */}
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-black">
          {/* 🔥 PROGRESS BARS */}
          <div className="absolute left-2 right-2 top-2 z-20 flex gap-1">
            {userStories.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 overflow-hidden rounded bg-white/30"
              >
                <div
                  className="h-full bg-white transition-all"
                  style={{
                    width:
                      i < storyIndex
                        ? "100%"
                        : i === storyIndex
                        ? `${progress}%`
                        : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* 👤 HEADER */}
          <div className="absolute left-4 right-4 top-4 z-20 flex items-center gap-3 text-white">
            <Avatar className="h-10 w-10 border border-white">
              {user.owner.avatar && (
                <SignedImage
                  keyPath={user.owner.avatar.key}
                  url={user.owner.avatar.url}
                  provider={user.owner.avatar.provider}
                  alt="avatar"
                  className="h-full w-full rounded-full object-cover"
                />
              )}
            </Avatar>

            <div>
              <p className="text-sm font-semibold">
                {user.isMe ? "Your Story" : user.owner.name}
              </p>
              <p className="text-xs opacity-70">
                {new Date(current.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* 🖼️ CONTENT */}
          {current.type === "text" ? (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-center text-lg font-semibold text-white">
              <p>{current.text}</p>
            </div>
          ) : current.media ? (
            <SignedImage
              url={current.media.thumbnailUrl || current.media.url}
              keyPath={current.media.key}
              provider={current.media.provider}
              alt="story"
              className="h-full w-full object-cover"
            />
          ) : null}

          {/* ❌ CLOSE */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-30 rounded-full bg-black/60 px-3 py-1 text-white"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}