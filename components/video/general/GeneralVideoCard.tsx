"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SignedImage } from "@/components/common/SignedImage";
import type { VideoItem } from "../types/video";

type Props = {
  video: VideoItem & { createdAt?: string | number | Date }; // createdAt optional
};

export default function GeneralVideoCard({ video }: Props) {
  const router = useRouter();
  const media = video.medias?.[0];
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [hovered, setHovered] = useState(false);

  if (!media) return null;

  // 🎬 duration formatter
  const duration = useMemo(() => {
    const sec = media.durationSec;
    if (!sec) return null;

    const m = Math.floor(sec / 60);
    const s = sec % 60;

    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [media.durationSec]);

  // 👀 views formatter
  const formattedViews = useMemo(() => {
    const views = video.viewCount ?? 0;

    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;

    return `${views} views`;
  }, [video.viewCount]);

  // 🕒 time ago (optional, only if exists and valid)
  const timeAgo = useMemo(() => {
    if (!video.createdAt) return "";

    let createdAtDate: Date;
    try {
      createdAtDate =
        video.createdAt instanceof Date
          ? video.createdAt
          : new Date(video.createdAt); // string | number → Date
      if (isNaN(createdAtDate.getTime())) return "";
    } catch {
      return "";
    }

    const diff = Date.now() - createdAtDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;

    return "Just now";
  }, [video.createdAt]);

  // ▶ hover preview autoplay
  const handleMouseEnter = () => {
    setHovered(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="w-full cursor-pointer"
      onClick={() => router.push(`/feed/videos/general/${video._id}`)}
    >
      {/* 🎬 Thumbnail / Hover Preview */}
      <div
        className="relative w-full aspect-video bg-black rounded-xl overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {!hovered && (
          <SignedImage
            url={media.thumbnailUrl || media.url}
            keyPath={media.key}
            provider={media.provider}
            alt={video.text || "video thumbnail"}
            className="w-full h-full object-cover"
          />
        )}

        {hovered && (
          <video
            ref={videoRef}
            src={media.url}
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
            {duration}
          </span>
        )}
      </div>

      {/* 📺 Meta */}
      <div className="flex gap-3 mt-3">
        <SignedImage
          url={video.author?.avatar?.url}
          keyPath={video.author?.avatar?.key}
          provider={video.author?.avatar?.provider}
          alt={video.author?.username || "avatar"}
          className="w-9 h-9 rounded-full object-cover"
        />

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold line-clamp-2">
            {video.text || "Untitled video"}
          </h3>

          <p className="text-xs text-muted-foreground truncate">
            {video.author?.username || "Unknown"}
          </p>

          <p className="text-xs text-muted-foreground">
            {formattedViews}
            {timeAgo && ` • ${timeAgo}`}
          </p>
        </div>
      </div>
    </div>
  );
}