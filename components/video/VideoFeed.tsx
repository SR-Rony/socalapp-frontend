"use client";

import { useEffect, useRef, useState } from "react";
import { SignedImage } from "@/components/common/SignedImage";
import { CircleChevronDown, CircleChevronUp } from "lucide-react";
import { fetchVideoFeed } from "./api/videos";
import ReelPlayer from "./reel/ReelPlayer";
import ReelActions from "./reel/ReelActions";
import ReelCommentDrawer from "./reel/ReelCommentDrawer";
import GeneralVideoCard from "./general/GeneralVideoCard";
import type { VideoItem } from "./types/video";

type VideoFeedProps = {
  type: "reels" | "general";
  singleVideoId?: string;
};

export default function VideoFeed({ type, singleVideoId }: VideoFeedProps) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cursor, setCursor] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [commentReel, setCommentReel] = useState<VideoItem | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  // 🔹 fetch videos
  const fetchVideos = async () => {
    if (!hasMore || loadingRef.current) return;
    loadingRef.current = true;

    try {
      const data = await fetchVideoFeed({
        type,
        cursor,
        limit: 10,
      });

      let newItems: VideoItem[] = data.items;

      // single video filter
      if (singleVideoId) {
        newItems = newItems.filter((v: VideoItem) => v._id === singleVideoId);
        setHasMore(false); // single video, no infinite scroll
      }

      setVideos(prev => [...prev, ...newItems]);
      setCursor(data.nextCursor);
      if (!data.nextCursor) setHasMore(false);
    } catch (err) {
      console.error("Video fetch failed", err);
    } finally {
      loadingRef.current = false;
    }
  };

  // 🔁 reset on type or singleVideoId change
  useEffect(() => {
    setVideos([]);
    setCursor(null);
    setHasMore(true);
    setActiveIndex(0);
    fetchVideos();
  }, [type, singleVideoId]);

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
      if (!singleVideoId) window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [videos, hasMore, singleVideoId]);

    return (
      <div className="w-full px-4 py-6 container mx-auto">
        <div
          className="
            grid gap-6
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-5
          "
        >
          {videos.map((video: VideoItem) => (
            <GeneralVideoCard key={video._id} video={video} />
          ))}
        </div>

        {!hasMore && videos.length > 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">
            No more videos
          </p>
        )}
        {videos.length === 0 && !hasMore && (
          <p className="text-center text-sm text-muted-foreground py-10">
            Video not found
          </p>
        )}
      </div>
    );
  }

  /* =========================================================
     🎬 REELS (snap style UI)
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
        {videos.map((video: VideoItem, index: number) => {
          const media = video.medias?.[0];
          const author = video.author;

          return (
            <div
              key={video._id}
              className="h-full w-full snap-start relative bg-black"
            >
              <ReelPlayer media={media} active={index === activeIndex} />

              {/* author + caption */}
              <div className="absolute bottom-16 left-4 right-20 text-white space-y-2 max-w-xs sm:max-w-sm">
                <div className="flex items-center gap-2">
                  {author?.avatar?.url && (
                    <SignedImage
                      url={author.avatar.url}
                      keyPath={author.avatar.key}
                      provider={author.avatar.provider}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span className="font-semibold">{author?.username || "Unknown"}</span>
                </div>

                {video.text && (
                  <p className="text-sm line-clamp-3">{video.text}</p>
                )}
              </div>

              {/* actions */}
              <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center gap-5 text-white">
                <ReelActions
                  reel={{
                    _id: video._id,
                    likeCount: video.likeCount ?? 0,
                    commentCount: video.commentCount ?? 0,
                    shareCount: video.shareCount ?? 0,
                    isLiked: video.isLiked ?? false,
                  }}
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
          reel={{
            _id: commentReel._id,
            text: commentReel.text,
            author: {
              username: commentReel.author?.username || "Unknown",
              avatar: commentReel.author?.avatar
                ? {
                    url: commentReel.author.avatar.url,
                    key: commentReel.author.avatar.key,
                    provider: commentReel.author.avatar.provider,
                  }
                : undefined,
            },
          }}
        />
      )}
    </div>
  );
}