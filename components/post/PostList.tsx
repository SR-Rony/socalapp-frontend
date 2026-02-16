"use client";

import { usePosts } from "@/hooks/usePosts";
import { useReels } from "@/hooks/useReels";
import Post from "./Post";
import ReelsPreviewRow from "../video/reel/ReelsPreviewRow";
import { useEffect, useState } from "react";

const REELS_INSERT_AFTER = 2;

export default function PostList() {
  const { posts, loading } = usePosts();
  const { reels: allReels } = useReels();

  const [reelsChunks, setReelsChunks] = useState<any[][]>([]);

  useEffect(() => {
    if (!allReels.length) return;

    const chunks = [];
    for (let i = 0; i < allReels.length; i += 5) {
      chunks.push(allReels.slice(i, i + 5));
    }
    setReelsChunks(chunks);
  }, [allReels]);

  if (loading) return <p className="text-center text-muted-foreground">Loading feed...</p>;
  if (!posts.length) return <p className="text-center text-muted-foreground">No posts found</p>;

  // merge feed
  const mergedFeed: (typeof posts[number] | "REELS")[] = [];
  posts.forEach((post, index) => {
    mergedFeed.push(post);
    if ((index + 1) % REELS_INSERT_AFTER === 0) {
      mergedFeed.push("REELS");
    }
  });

  let reelsIndex = 0;

  return (
    <div className="flex flex-col gap-4">
      {mergedFeed.map((item, i) => {
        if (item === "REELS") {
          if (reelsIndex >= reelsChunks.length) return null;
          const reelsChunk = reelsChunks[reelsIndex];
          reelsIndex++;
          return <ReelsPreviewRow key={`reels-${i}`} reels={reelsChunk} />;
        }
        return <Post key={item._id} post={item} onEdit={(p) => console.log("Edit post:", p)} onDelete={(id) => console.log("Delete post:", id)} />;
      })}
    </div>
  );
}
