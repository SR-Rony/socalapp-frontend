"use client";

import { useEffect, useRef, useState } from "react";
import { SignedImage } from "@/components/common/SignedImage";
import { CircleChevronDown, CircleChevronUp } from "lucide-react";
import { fetchVideoFeed } from "./api/videos";
import ReelPlayer from "./reel/ReelPlayer";
import ReelActions from "./reel/ReelActions";
import { VideoItem } from "./types/video";
import ReelCommentDrawer from "./reel/ReelCommentDrawer";

export default function VideoFeed({
  type,
}: {
  type: "reels" | "general";
}) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cursor, setCursor] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [commentReel, setCommentReel] = useState<VideoItem | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchVideos = async () => {
    if (!hasMore) return;

    const data = await fetchVideoFeed({
      type,
      cursor,
      limit: 5,
    });

    setVideos((prev) => [...prev, ...data.items]);
    setCursor(data.nextCursor);
    setHasMore(data.hasMore);
  };

  useEffect(() => {
    // 🔥 type change হলে reset feed
    setVideos([]);
    setCursor(null);
    setHasMore(true);
    fetchVideos();
  }, [type]);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const height = window.innerHeight;
    const index = Math.round(scrollTop / height);

    setActiveIndex(index);

    if (index >= videos.length - 2) fetchVideos();
  };

  const nextVideo = () => {
    setActiveIndex((prev) => Math.min(prev + 1, videos.length - 1));
    containerRef.current?.scrollTo({
      top: (activeIndex + 1) * window.innerHeight,
      behavior: "smooth",
    });
  };

  const prevVideo = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
    containerRef.current?.scrollTo({
      top: (activeIndex - 1) * window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative h-screen">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full md:w-1/3 mx-auto overflow-y-hidden snap-y snap-mandatory"
      >
        {videos.map((video, index) => {
          const media = video.medias?.[0];

          return (
            <div
              key={video._id}
              className="h-full w-full snap-start relative bg-black"
            >
              <ReelPlayer media={media} active={index === activeIndex} />

              {/* author + caption */}
              <div className="absolute bottom-16 left-4 right-20 text-white space-y-2 max-w-xs sm:max-w-sm">
                <div className="flex items-center gap-2">
                  {video.author.avatar?.url && (
                    <SignedImage
                      url={video.author.avatar.url}
                      keyPath={video.author.avatar.key}
                      provider={video.author.avatar.provider}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span className="font-semibold">
                    {video.author.username}
                  </span>
                </div>

                {video.text && (
                  <p className="text-sm line-clamp-3">{video.text}</p>
                )}
              </div>

              {/* actions */}
              <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center gap-5 text-white">
                <ReelActions
                  reel={video}
                  onCommentClick={() => setCommentReel(video)}
                />
              </div>
            </div>
          );
        })}

        {/* arrows desktop */}
        <button
          onClick={prevVideo}
          className="hidden md:flex absolute top-1/2 right-14 -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full z-20"
        >
          <CircleChevronUp size={40} />
        </button>

        <button
          onClick={nextVideo}
          className="hidden md:flex absolute top-1/2 right-14 translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full z-20"
        >
          <CircleChevronDown size={40} />
        </button>
      </div>

      {commentReel && (
        <ReelCommentDrawer
          open={!!commentReel}
          onClose={() => setCommentReel(null)}
          reel={commentReel}
        />
      )}
    </div>
  );
}
