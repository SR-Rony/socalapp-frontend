import { useResolvedMediaUrl } from "@/hooks/useResolvedMediaUrl";
import React, { memo } from "react";

type SignedImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  url?: string;
  keyPath?: string;
  provider?: string; // "wasabi"
  showLoader?: boolean;
};

function SignedImageBase({
  url,
  keyPath,
  provider,
  showLoader = false,
  ...rest
}: SignedImageProps) {
  const { uri, loading } = useResolvedMediaUrl({ url, keyPath, provider });

  if (!uri && loading && showLoader) return <div>Loading...</div>;
  if (!uri) return null;

  return <img {...rest} src={uri} />;
}

export const SignedImage = memo(SignedImageBase);

type SignedVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  url?: string;
  keyPath?: string;
  provider?: string; // "wasabi"
  posterUrl?: string; // optional
  showLoader?: boolean;
};

function SignedVideoBase({
  url,
  keyPath,
  provider,
  poster,
  posterUrl,
  showLoader = false,
  ...rest
}: SignedVideoProps) {
  const { uri, loading } = useResolvedMediaUrl({ url, keyPath, provider });

  if (!uri && loading && showLoader) return <div>Loading...</div>;
  if (!uri) return null;

  return <video {...rest} src={uri} poster={posterUrl || poster} />;
}

export const SignedVideo = memo(SignedVideoBase);