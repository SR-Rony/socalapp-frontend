"use client";

import { useEffect, useRef } from "react";
import { SignedVideo } from "@/components/common/SignedVideo";

type Props = {
  media?: {
    url?: string;
    key?: string;
    provider?: string;
  };
  active: boolean;
};

export default function ReelPlayer({ media, active }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (active) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [active]);

  if (!media) return null;

  return (
    <SignedVideo
      url={media.url}
      keyPath={media.key}
      provider={media.provider}
      loop
      muted
      playsInline
      className="w-full h-full object-cover"
    />
  );
}
