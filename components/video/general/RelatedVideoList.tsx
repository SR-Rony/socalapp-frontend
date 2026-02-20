"use client";

import { useRouter } from "next/navigation";
import { SignedImage } from "@/components/common/SignedImage";
import type { VideoItem } from "../types/video";

export default function RelatedVideoList({
  videos,
}: {
  videos: VideoItem[];
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      {videos.map((video) => {
        const media = video.medias?.[0];
        if (!media) return null;

        return (
          <div
            key={video._id}
            onClick={() => router.push(`/feed/videos/general/${video._id}`)}
            className="flex gap-3 cursor-pointer"
          >
            {/* thumbnail */}
            <div className="w-40 aspect-video bg-black rounded-lg overflow-hidden">
              <SignedImage
                url={media.thumbnailUrl || media.url}
                keyPath={media.key}
                provider={media.provider}
                className="w-full h-full object-cover"
              />
            </div>

            {/* meta */}
            <div className="flex-1">
              <p className="text-sm font-medium line-clamp-2">
                {video.text || "Untitled video"}
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                {video.author?.username}
              </p>

              <p className="text-xs text-muted-foreground">
                {video.viewCount} views
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
