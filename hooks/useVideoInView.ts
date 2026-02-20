import { RefObject, useEffect } from "react";

export const useVideoInView = (
  ref: RefObject<HTMLVideoElement | null>, // ✅ FIX
  autoPlay = true
) => {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          autoPlay && video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [ref, autoPlay]);
};