"use client";

import { Avatar } from "@/components/ui/avatar";
import { SignedImage } from "@/components/common/SignedImage";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  stories: any[];
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
  const userStories = user.stories || [user.lastStory];
  const current = userStories[storyIndex];


  console.log("story",stories);
  console.log("userIndex",userIndex);
  console.log("storyIndex",storyIndex);
  console.log("onClose",onClose);
  console.log("onChange",onChange);
  




  // 👉 NEXT
  const next = () => {
    if (storyIndex < userStories.length - 1) {
      onChange(userIndex, storyIndex + 1);
    } else if (userIndex < stories.length - 1) {
      onChange(userIndex + 1, 0);
    }
  };

  // 👉 PREV
  const prev = () => {
    if (storyIndex > 0) {
      onChange(userIndex, storyIndex - 1);
    } else if (userIndex > 0) {
      const prevUserStories =
        stories[userIndex - 1].stories ||
        [stories[userIndex - 1].lastStory];

      onChange(userIndex - 1, prevUserStories.length - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 h-[90vh] w-full max-w-md">
        {/* LEFT */}
        {(userIndex > 0 || storyIndex > 0) && (
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* RIGHT */}
        {(userIndex < stories.length - 1 ||
          storyIndex < userStories.length - 1) && (
          <button
            onClick={next}
            className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* STORY CARD */}
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-black">
          {/* HEADER */}
          <div className="absolute left-4 right-4 top-4 z-20 flex items-center gap-3 text-white">
            <Avatar className="h-10 w-10 border border-white">
              {user.owner.avatar && (
                <SignedImage
                  keyPath={user.owner.avatar.key}
                  url={user.owner.avatar.url}
                  provider={user.owner.avatar.provider}
                  alt="avatar"
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

          {/* CONTENT */}
          {current.type === "video" ? (
            <video
              src={current.media.url}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          ) : current.type === "image" ? (
            <SignedImage
              keyPath={current.media.key}
              url={current.media.url}
              provider={current.media.provider}
              alt="story"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-center text-lg font-semibold text-white">
              {current.text}
            </div>
          )}

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
