"use client";

import { SignedVideo } from "@/components/common/SignedVideo";
import { SignedImage } from "@/components/common/SignedImage";
import type { VideoItem } from "../types/video";

export default function VideoPlayerSection({
  video,
}: {
  video: VideoItem;
}) {
  const media = video.medias?.[0];
  if (!media) return null;
  

  return (
    <div>
      {/* 🎬 Big player */}
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
        <SignedVideo
          url={media.url}
          keyPath={media.key}
          provider={media.provider}
          mode="watch"
        />
      </div>

      {/* 📝 Title */}
      <h1 className="text-lg font-semibold mt-4">
        {video.text || "Untitled video"}
      </h1>

      {/* 👤 Channel row */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          <SignedImage
            url={video.author?.avatar?.url}
            keyPath={video.author?.avatar?.key}
            provider={video.author?.avatar?.provider}
            className="w-10 h-10 rounded-full"
          />

          <div>
            <p className="text-sm font-medium">
              {video.author?.username}
            </p>
            <p className="text-xs text-muted-foreground">
              {video.viewCount} views
            </p>
          </div>
        </div>

        <button className="bg-black text-white text-sm px-4 py-1.5 rounded-full">
          Subscribe
        </button>
      </div>
    </div>
  );
}
