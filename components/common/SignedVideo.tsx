import { useResolvedMediaUrl } from "@/hooks/useResolvedMediaUrl";
import { memo } from "react";

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
  const  finalUri  = useResolvedMediaUrl({ url, keyPath, provider });
  

  if (!finalUri && showLoader) return <div>Loading...</div>;
  if (!finalUri) return null;

  return <video controls className="w-full rounded-lg">
    <source src={finalUri} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
}

export const SignedVideo = memo(SignedVideoBase);