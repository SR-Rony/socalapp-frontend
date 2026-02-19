"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SignedImage } from "@/components/common/SignedImage";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import type { VideoItem } from "../types/video";

type Props = {
  video: VideoItem;
  onCommentClick?: (video: VideoItem) => void;
};

export default function GeneralVideoCard({ video, onCommentClick }: Props) {
  


  const router = useRouter();
  const media = video.medias?.[0];
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(video.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(video.likeCount ?? 0);

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

  // 🔢 number formatter
  const formatNumber = (num?: number) => {
    const n = num ?? 0;

    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;

    return `${n}`;
  };

  // 👍 like toggle
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // navigation prevent
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
  };

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
    <div className="w-full">
      {/* 🎬 Thumbnail / Hover Preview */}
      <div
        className="relative w-full aspect-video bg-black rounded-xl overflow-hidden cursor-pointer"
        onClick={() => router.push(`/feed/videos/general/${video._id}`)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Thumbnail */}
        {!hovered && (
          <SignedImage
            url={media.thumbnailUrl || media.url}
            keyPath={media.key}
            provider={media.provider}
            alt={video.text || "video thumbnail"}
            className="w-full h-full object-cover"
          />
        )}

        {/* Hover autoplay video */}
        {hovered && (
          <video
            ref={videoRef}
            src={media.url}
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Duration badge */}
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
          </p>
        </div>
      </div>

      {/* 🔥 Actions Row */}
      <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
        {/* Like */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 ${
            liked ? "text-blue-600" : "hover:text-foreground"
          }`}
        >
          <ThumbsUp size={18} />
          <span>{formatNumber(likeCount)}</span>
        </button>

        {/* Comment */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCommentClick?.(video);
          }}
          className="flex items-center gap-1 hover:text-foreground"
        >
          <MessageCircle size={18} />
          <span>{formatNumber(video.commentCount)}</span>
        </button>

        {/* Share */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 hover:text-foreground"
        >
          <Share2 size={18} />
          <span>{formatNumber(video.shareCount)}</span>
        </button>
      </div>
    </div>
  );
}
