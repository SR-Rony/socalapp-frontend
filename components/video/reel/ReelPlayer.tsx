"use client";

import { useRef, useEffect } from "react";
import { SignedVideo } from "@/components/common/SignedVideo";
import api from "@/lib/api";

type Props = {
  media?: {
    url?: string;
    key?: string;
    provider?: string;
  };
  active?: boolean;            // active full view
  preview?: boolean;           // preview thumbnail mode
  videoId?: string;
  category?: string;
  subCategory?: string;
};

export default function ReelPlayer({
  media,
  active = false,
  preview = false,
  videoId,
  category,
  subCategory,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /* =========================
     Watch time tracking (only if not preview)
  ========================= */
  const watchStartRef = useRef<number | null>(null);
  const totalWatchedRef = useRef<number>(0);
  const interestSentRef = useRef(false);

  const handlePlay = () => {
    if (preview) return; // preview mode ignore
    if (watchStartRef.current === null) {
      watchStartRef.current = Date.now();
    }
  };

  const handlePauseOrEnd = async () => {
    if (preview) return;
    if (watchStartRef.current !== null) {
      const watchedNow = (Date.now() - watchStartRef.current) / 1000;
      totalWatchedRef.current += watchedNow;
      watchStartRef.current = null;
    }
    await sendInterestIfNeeded();
  };

  const sendInterestIfNeeded = async () => {
    if (!videoId || interestSentRef.current) return;

    const watchedSec = Math.floor(totalWatchedRef.current);
    if (watchedSec < 3) return; // 3 sec threshold for reels

    try {
      await api.post("/videos/interest", {
        postId: videoId,
        category: category || "reels",
        subCategory: subCategory || "",
        watchedSec,
      });
      interestSentRef.current = true;
    } catch (e) {
      console.log("Reel interest tracking failed");
    }
  };

  /* =========================
     autoplay / pause when active changes
  ========================= */
  useEffect(() => {
    if (!videoRef.current || preview) return;

    if (active) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [active, preview]);

  /* =========================
     cleanup on unmount
  ========================= */
  useEffect(() => {
    return () => {
      handlePauseOrEnd();
    };
  }, []);

  if (!media) return null;

  return (
    <div className={`${preview ? "h-[200px]" : "h-full"} w-full`}>
      <SignedVideo
        ref={videoRef}
        url={media.url}
        keyPath={media.key}
        provider={media.provider}
        mode="reels"
        onPlay={handlePlay}
        onPause={handlePauseOrEnd}
        onEnded={handlePauseOrEnd}
      />
    </div>
  );
}