import { useEffect } from "react";

export function useVideoInView(
  videoRef: React.RefObject<HTMLVideoElement>,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled || !videoRef.current) return;

    const video = videoRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!video) return;

        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      {
        threshold: 0.6, // 60% visible হলে play
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [videoRef, enabled]);
}
