import { useResolvedMediaUrl } from "@/hooks/useResolvedMediaUrl";
import { memo, useRef, useState } from "react";
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
};

function SignedVideoBase({
  url,
  keyPath,
  provider,
  posterUrl,
  mode = "feed",
  className = "",
}: SignedVideoProps) {
  const finalUri = useResolvedMediaUrl({ url, keyPath, provider });
  const videoRef = useRef<HTMLVideoElement>(null);

  const isReels = mode === "reels";

  // 🔇 default muted (feed + reels both)
  const [muted, setMuted] = useState(true);

  // ✅ viewport autoplay/pause for BOTH feed & reels
  useVideoInView(videoRef, true);

  if (!finalUri) return null;

  // ▶️ Reels tap play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  };

  // 🔊 sound toggle (reels only UI, but feed still can unmute via controls)
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
        controls={!isReels} // 🎛 Feed → controls ON | Reels → OFF
        className={`w-full h-full ${className}`}
        onClick={isReels ? togglePlay : undefined}
      />

      {/* 🔊 Reels sound button */}
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
}

export const SignedVideo = memo(SignedVideoBase);
