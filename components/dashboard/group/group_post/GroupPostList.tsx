"use client";

import { useEffect, useRef } from "react";
import GroupPostCard from "./GroupPostCard";

export default function GroupPostList({
  posts,
  loadMore,
  hasMore,
}: any) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore) return;

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });

    if (ref.current) io.observe(ref.current);

    return () => io.disconnect();
  }, [hasMore]);

  return (
    <>
      {posts.map((p: any) => (
        <GroupPostCard key={p._id} post={p} />
      ))}

      {hasMore && <div ref={ref} className="h-10" />}
    </>
  );
}
