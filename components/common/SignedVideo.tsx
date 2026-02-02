// src/components/common/SignedVideo.tsx
"use client";

import { memo } from "react";
import { useResolvedMediaUrl } from "@/hooks/useResolvedMediaUrl";

type Props = {
  url?: string;
  keyPath?: string;
  provider?: string;
  className?: string;
  controls?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
};

function SignedVideoBase({
  url,
  keyPath,
  provider,
  className,
  controls = true,
  muted = false,
  autoPlay = false,
}: Props) {
  const finalUrl = useResolvedMediaUrl({ url, keyPath, provider });

  if (!finalUrl) return null;

  return (
    <video
      src={finalUrl}
      controls={controls}
      muted={muted}
      autoPlay={autoPlay}
      playsInline
      className={`w-full rounded-lg ${className ?? ""}`}
    />
  );
}

export const SignedVideo = memo(SignedVideoBase);
