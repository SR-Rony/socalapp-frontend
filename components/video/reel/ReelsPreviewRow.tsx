"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ReelPlayer from "./ReelPlayer";
import Link from "next/link";
import { SignedImage } from "@/components/common/SignedImage";
import { useRouter } from "next/navigation";

interface ReelsPreviewRowProps {
  reels: any[];
}

export default function ReelsPreviewRow({ reels }: ReelsPreviewRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 👇 track which chunk of reels is currently visible
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const cardWidth = 220 + 12; // card width + gap

  const totalSlides = Math.ceil(reels.length / 2); // slide 2 reels each click

  const handleRight = () => {
    if (!scrollRef.current) return;
    const newIndex = Math.min(visibleIndex + 1, totalSlides - 1);
    setVisibleIndex(newIndex);

    scrollRef.current.scrollTo({
      left: newIndex * 2 * cardWidth,
      behavior: "smooth",
    });
  };

  const handleLeft = () => {
    if (!scrollRef.current) return;
    const newIndex = Math.max(visibleIndex - 1, 0);
    setVisibleIndex(newIndex);

    scrollRef.current.scrollTo({
      left: newIndex * 2 * cardWidth,
      behavior: "smooth",
    });
  };

  // update arrow visibility
  useEffect(() => {
    setShowLeft(visibleIndex > 0);
    setShowRight(visibleIndex < totalSlides - 1);
  }, [visibleIndex, totalSlides]);

  if (!reels?.length) return null;

  return (
    <div className="relative my-4">
      <h3 className="text-sm font-semibold mb-2 px-1">Reels for you</h3>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-hidden scroll-smooth"
      >
        {reels.map((reel) => (
          <div onClick={() => router.push(`/feed/videos/reels/${reel._id}`)}
            key={reel._id}
            className="min-w-[220px] max-w-[220px] h-[390px] rounded-xl overflow-hidden bg-black"
          >
            {/* <ReelPlayer
              media={reel.video}
              active={true}        // user opened full reel
              videoId={reel._id}   // interest tracking
              category={reel.category}
              subCategory={reel.subCategory}
            /> */}
            <SignedImage
                url={reel.video.thumbnailUrl || reel.video.url}
                keyPath={reel.video.key}
                provider={reel.video.provider}
                alt={"video thumbnail"}
                className="w-full h-full"
              />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      {showLeft && (
        <button
          onClick={handleLeft}
          className="absolute top-1/2 -translate-y-1/2 left-0 bg-white shadow rounded-full p-2 z-10"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Right Arrow */}
      {showRight && (
        <button
          onClick={handleRight}
          className="absolute top-1/2 -translate-y-1/2 right-0 bg-white shadow rounded-full p-2 z-10"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
