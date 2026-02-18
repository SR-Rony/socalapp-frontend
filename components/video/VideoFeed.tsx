"use client";

import { useEffect, useRef, useState } from "react";
import { SignedImage } from "@/components/common/SignedImage";
import { CircleChevronDown, CircleChevronUp } from "lucide-react";
import { fetchVideoFeed } from "./api/videos";
import ReelPlayer from "./reel/ReelPlayer";
import ReelActions from "./reel/ReelActions";
import ReelCommentDrawer from "./reel/ReelCommentDrawer";
import GeneralVideoCard from "./general/GeneralVideoCard";
import { VideoItem } from "./types/video";

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
  const loadingRef = useRef(false);

  const fetchVideos = async () => {
    if (!hasMore || loadingRef.current) return;

    loadingRef.current = true;

    const data = await fetchVideoFeed({
      type,
      cursor,
      limit: 5,
    });

    setVideos((prev) => [...prev, ...data.items]);
    setCursor(data.nextCursor);
    setHasMore(data.hasMore);

    loadingRef.current = false;
  };

  // 🔁 type change → reset feed
  useEffect(() => {
    setVideos([]);
    setCursor(null);
    setHasMore(true);
    setActiveIndex(0);
    fetchVideos();
  }, [type]);

  /* =========================================================
     🎬 GENERAL VIDEO (YouTube style feed)
  ========================================================== */
  if (type === "general") {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewport = window.innerHeight;
      const fullHeight = document.body.offsetHeight;

      if (scrollY + viewport >= fullHeight - 400) {
        fetchVideos();
      }
    };

    useEffect(() => {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [videos, hasMore]);

    return (
      <div className="w-full max-w-2xl mx-auto py-4 px-2">
        {videos.map((video) => (
          <GeneralVideoCard key={video._id} video={video} />
        ))}

        {!hasMore && (
          <p className="text-center text-sm text-muted-foreground py-6">
            No more videos
          </p>
        )}
      </div>
    );
  }

  /* =========================================================
     🎬 REELS (existing snap UI)
  ========================================================== */

  const handleScroll = () => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const height = window.innerHeight;
    const index = Math.round(scrollTop / height);

    setActiveIndex(index);

    if (index >= videos.length - 2) fetchVideos();
  };

  const nextVideo = () => {
    const next = Math.min(activeIndex + 1, videos.length - 1);
    setActiveIndex(next);
    containerRef.current?.scrollTo({
      top: next * window.innerHeight,
      behavior: "smooth",
    });
  };

  const prevVideo = () => {
    const prev = Math.max(activeIndex - 1, 0);
    setActiveIndex(prev);
    containerRef.current?.scrollTo({
      top: prev * window.innerHeight,
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
