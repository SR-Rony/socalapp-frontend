"use client";

import { useMemo, useState } from "react";
import { SignedImage } from "@/components/common/SignedImage";
import { SignedVideo } from "@/components/common/SignedVideo";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import type { VideoItem } from "../types/video";

type Props = {
  video: VideoItem;
  onCommentClick?: (video: VideoItem) => void;
};

export default function GeneralVideoCard({ video, onCommentClick }: Props) {
  const media = video.medias?.[0];

  const [play, setPlay] = useState(false);
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
  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
  };

  return (
    <div className="w-full max-w-[720px] mx-auto mb-6">
      {/* Thumbnail / Player */}
      <div
        className={`relative w-full aspect-video bg-black rounded-xl overflow-hidden ${
          !play ? "cursor-pointer" : ""
        }`}
        onClick={() => {
          if (!play) setPlay(true);
        }}
      >
        {!play ? (
          <>
            <SignedImage
              url={media.thumbnailUrl || media.url}
              keyPath={media.key}
              provider={media.provider}
              alt={video.text || "video thumbnail"}
              className="w-full h-full object-cover"
            />

            {duration && (
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                {duration}
              </span>
            )}
          </>
        ) : (
          <SignedVideo
            url={media.url}
            keyPath={media.key}
            provider={media.provider}
            controls
            autoPlay
            className="w-full h-full"
          />
        )}
      </div>

      {/* Meta */}
      <div className="flex gap-3 mt-3">
        <SignedImage
          url={video.author?.avatar?.url}
          keyPath={video.author?.avatar?.key}
          provider={video.author?.avatar?.provider}
          alt={video.author?.username || "avatar"}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold line-clamp-2">
            {video.text || "Untitled video"}
          </h3>

          <p className="text-xs text-muted-foreground truncate">
            {video.author?.username || "Unknown"} • {formattedViews}
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
          onClick={() => onCommentClick?.(video)}
          className="flex items-center gap-1 hover:text-foreground"
        >
          <MessageCircle size={18} />
          <span>{formatNumber(video.commentCount)}</span>
        </button>

        {/* Share */}
        <button className="flex items-center gap-1 hover:text-foreground">
          <Share2 size={18} />
          <span>{formatNumber(video.shareCount)}</span>
        </button>
      </div>
    </div>
  );
}
