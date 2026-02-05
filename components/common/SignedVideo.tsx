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

  console.log("video final",finalUri);
  

  if (!finalUri && showLoader) return <div>Loading...</div>;
  if (!finalUri) return null;

  return <video {...rest} src={finalUri} poster={posterUrl || poster} />;
}

export const SignedVideo = memo(SignedVideoBase);