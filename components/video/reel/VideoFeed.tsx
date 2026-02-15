"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import ReelPlayer from "./ReelPlayer";
import { SignedImage } from "@/components/common/SignedImage";
import { CircleChevronDown, CircleChevronUp } from "lucide-react";
import ReelActions from "./ReelActions";
import ReelCommentDrawer from "./ReelCommentDrawer";

type ReelItem = {
  _id: string;
  text?: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  medias: {
    url?: string;
    key?: string;
    provider?: string;
  }[];
  author: {
    _id: string;
    name: string;
    username: string;
    avatar?: { url?: string; key?: string; provider?: string };
  };
};

export default function ReelsFeed() {
  const [videos, setVideos] = useState<ReelItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cursor, setCursor] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [commentReel, setCommentReel] = useState<ReelItem | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchVideos = async () => {
    if (!hasMore) return;
    const res = await api.get("/videos/feed/reels", {
      params: {
        limit: 5,
        cursor: cursor ? JSON.stringify(cursor) : undefined,
      },
    });
    const data = res.data;
    setVideos((prev) => [...prev, ...data.items]);
    setCursor(data.nextCursor);
    setHasMore(data.hasMore);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = window.innerHeight;
    const index = Math.round(scrollTop / height);
    setActiveIndex(index);

    if (index >= videos.length - 2) fetchVideos();
  };

  // arrow buttons
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
  {videos.map((reel, index) => {
    const media = reel.medias?.[0];
    return (
      <div key={reel._id} className="h-full w-full snap-start relative bg-black">
        {/* video full screen */}
        <ReelPlayer media={media} active={index === activeIndex} />

        {/* bottom left: author + caption */}
        <div className="absolute bottom-16 left-4 right-20 text-white space-y-2 max-w-xs sm:max-w-sm">
          <div className="flex items-center gap-2">
            {reel.author.avatar?.url && (
              <SignedImage
                url={reel.author.avatar.url}
                keyPath={reel.author.avatar.key}
                provider={reel.author.avatar.provider}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span className="font-semibold">{reel.author.username}</span>
          </div>
          {reel.text && <p className="text-sm line-clamp-3">{reel.text}</p>}
        </div>

        {/* right actions: vertical middle */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center gap-5 text-white">
          <ReelActions
            reel={reel}
            onCommentClick={() => setCommentReel(reel)}
          />
        </div>
      </div>
    );
  })}

    {/* arrow buttons: desktop */}
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
   {/* ✅ COMMENT DRAWER */}
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

function Action({ icon, count }: { icon: string; count: number }) {
  return (
    <div className="flex flex-col items-center text-sm">
      <button className="text-2xl">{icon}</button>
      {count > 0 && <span>{count}</span>}
    </div>
  );
}
