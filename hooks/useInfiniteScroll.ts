import { useEffect, useRef } from "react";

export const useInfiniteScroll = (onLoadMore: () => void) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onLoadMore]);

  return ref;
};
