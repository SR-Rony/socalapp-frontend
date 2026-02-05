"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Post, { PostData } from "./Post";

type FeedItem = {
  data: {
    author: {
      name: string;
      username: string;
      _id: string;
      avatar?: {
        key?: string;
        url?: string;
        provider?: string;
      };
    };
    text: string;
    medias: {
      key?: string;
      url?: string;
      type: "image" | "video";
      provider?: string;
    }[];
    createdAt: string;
  };
};

export default function PostList() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await api.get("/posts/feed", { params: { limit: 10 } });
        

        if (res.data?.success && Array.isArray(res.data.items)) {
          const mappedPosts: PostData[] = res.data.items.map(
            (item: FeedItem) => {
              const post = item.data;
              const mediaItem = post.medias?.[0];

              return {
                user: {
                  name: post.author?.name || "Unknown",
                  username: post.author?.username || "unknown",
                  userId: post.author?._id || "unknown",
                  avatar: post.author?.avatar
                    ? {
                        key: post.author.avatar.key,
                        url: post.author.avatar.url,
                        provider: post.author.avatar.provider,
                      }
                    : {
                        url: "https://ui-avatars.com/api/?name=User",
                      },
                },
                time: formatTime(post.createdAt),
                content: post.text,
                media: mediaItem
                  ? {
                      type: mediaItem.type,
                      key: mediaItem.key,
                      url: mediaItem.url,
                      provider: mediaItem.provider,
                    }
                  : null,
              };
            }
          );

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
    return (
      <p className="text-center text-muted-foreground">Loading feed...</p>
    );

  if (!posts.length)
    return (
      <p className="text-center text-muted-foreground">No posts found</p>
    );

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post, i) => (
        <Post
          key={i}
          {...post}
          onEdit={(p) => console.log("Edit post:", p)}
          onDelete={(id) => console.log("Delete post:", id)}
        />
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
