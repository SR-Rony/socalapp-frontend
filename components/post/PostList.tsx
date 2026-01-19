"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Post, { PostData } from "./Post";

/* 🔹 Backend item type (minimum needed) */
type FeedItem = {
  _id: string;
  author: {
    name: string;
    avatar?: { url: string } | string;
  };
  type: "image" | "video";
  text: string;
  medias: { url: string; type: "image" | "video" }[];
  createdAt: string;
};

export default function PostList() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await api.get("/posts/feed", { params: { limit: 10 } });

        if (res.data?.success && Array.isArray(res.data.items)) {
          const mappedPosts: PostData[] = res.data.items.map((item: FeedItem) => {
            const mediaItem = item.medias?.[0];

            return {
              user: {
                name: item.author?.name || "Unknown",
                avatar:
                  typeof item.author?.avatar === "string"
                    ? item.author.avatar
                    : item.author?.avatar?.url || "https://ui-avatars.com/api/?name=User",
              },
              time: formatTime(item.createdAt),
              content: item.text,
              media: mediaItem?.url,
              mediaType: mediaItem?.type || "image",
            };
          });

          setPosts(mappedPosts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Feed load failed", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading)
    return <p className="text-center text-muted-foreground">Loading feed...</p>;

  if (!posts.length)
    return <p className="text-center text-muted-foreground">No posts found</p>;

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post, i) => (
        <Post key={i} {...post} />
      ))}
    </div>
  );
}

function formatTime(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
