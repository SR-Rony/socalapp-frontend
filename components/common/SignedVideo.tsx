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

  /* 🎯 video events */
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

    // 👇 use external ref if provided, else internal
    const videoRef =
      (ref as React.MutableRefObject<HTMLVideoElement | null>) || internalRef;

    const isReels = mode === "reels";

    const [muted, setMuted] = useState(true);

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
      <div className={`relative w-full ${isReels ? "h-screen" : ""}`}>
        <video
          ref={videoRef}
          src={finalUri}
          loop
          muted={muted}
          playsInline
          poster={posterUrl}
          controls={!isReels}
          className={`w-full h-full ${className}`}
          onClick={isReels ? togglePlay : undefined}
          onPlay={onPlay}
          onPause={onPause}
          onEnded={onEnded}
        />

        {isReels && (
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
        )}
      </div>
    );
  },
);

SignedVideoBase.displayName = "SignedVideo";

export const SignedVideo = memo(SignedVideoBase);