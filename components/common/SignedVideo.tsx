"use client";

import { useResolvedMediaUrl } from "@/hooks/useResolvedMediaUrl";
import { memo, useRef, useState, forwardRef } from "react";
import { useVideoInView } from "@/hooks/useVideoInView";
import { Volume2, VolumeX } from "lucide-react";

type VideoMode = "feed" | "reels";

type SignedVideoProps = {
  url?: string;
  keyPath?: string;
  provider?: string;
  posterUrl?: string;
  mode?: VideoMode;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
};

const SignedVideoBase = forwardRef<HTMLVideoElement, SignedVideoProps>(
  (
    {
      url,
      keyPath,
      provider,
      posterUrl,
      mode = "feed",
      className = "",
      onPlay,
      onPause,
      onEnded,
    },
    ref,
  ) => {
    const finalUri = useResolvedMediaUrl({ url, keyPath, provider });

    const internalRef = useRef<HTMLVideoElement>(null);
    const videoRef =
      (ref as React.MutableRefObject<HTMLVideoElement | null>) || internalRef;

    const isReels = mode === "reels";

    const [muted, setMuted] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    useVideoInView(videoRef, true);

    if (!finalUri) return null;

    const togglePlay = () => {
      if (!videoRef.current) return;

      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    };

    const toggleSound = () => {
      if (!videoRef.current) return;

      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    };

    return (
      <div className="relative w-full">
        {/* 🎯 Feed mode → YouTube style 16:9 container */}
        {!isReels && (
          <div className="relative w-full aspect-video bg-black overflow-hidden rounded-xl">
            {/* 🧊 Skeleton loader */}
            {!isLoaded && (
              <div className="absolute inset-0 animate-pulse bg-muted" />
            )}

            {/* 🖼️ Poster thumbnail (YouTube style) */}
            {posterUrl && !isLoaded && (
              <img
                src={posterUrl}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            <video
              ref={videoRef}
              src={finalUri}
              loop
              muted={muted}
              playsInline
              poster={posterUrl}
              controls
              className={`w-full h-full transition-opacity duration-300 ${
                isLoaded ? "opacity-100" : "opacity-0"
              } ${className}`}
              onLoadedData={() => setIsLoaded(true)}
              onPlay={onPlay}
              onPause={onPause}
              onEnded={onEnded}
            />
          </div>
        )}

        {/* 🎯 Reels mode → full screen */}
        {isReels && (
          <div className="relative w-full h-screen">
            <video
              ref={videoRef}
              src={finalUri}
              loop
              muted={muted}
              playsInline
              poster={posterUrl}
              className="w-full h-full object-cover"
              onClick={togglePlay}
              onPlay={onPlay}
              onPause={onPause}
              onEnded={onEnded}
            />

            <button
              onClick={toggleSound}
              className="absolute bottom-4 right-4 bg-black/60 text-white p-2 rounded-full"
            >
              {muted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>
    );
  },
);

SignedVideoBase.displayName = "SignedVideo";
export const SignedVideo = memo(SignedVideoBase);