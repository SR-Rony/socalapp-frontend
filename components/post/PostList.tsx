"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Post from "./Post";
import type { PostData } from "./Post"; // ✅ PostData এক জায়গা থেকে

// 🔥 Backend feed item (REAL structure)
type FeedItem = {
  data: {
    _id: string;

    author: {
      _id: string;
      name: string;
      username: string;
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

    // 🔥 COUNTS & FLAGS (IMPORTANT)
    likeCount: number;
    commentCount: number;
    shareCount: number;
    isLiked: boolean;
    isShared: boolean;
  };
};

type FeedResponse = {
  success: boolean;
  items: FeedItem[];
};

export default function PostList() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await api.get<FeedResponse>("/posts/feed", {
          params: { limit: 10 },
        });

        if (res.data?.success && Array.isArray(res.data.items)) {
          const mappedPosts: PostData[] = res.data.items.map((item) => {
            const post = item.data;
            const mediaItem = post.medias?.[0];

            return {
              _id: post._id,
              authorId: post.author._id,

              user: {
                name: post.author.name,
                username: post.author.username,
                userId: post.author._id,
                avatar: post.author.avatar,
              },

              content: post.text,
              time: formatTime(post.createdAt),

              media: mediaItem
                ? {
                    type: mediaItem.type,
                    key: mediaItem.key,
                    url: mediaItem.url,
                    provider: mediaItem.provider,
                  }
                : null,

              // 🔥 PASS ALL COUNTS
              likeCount: post.likeCount ?? 0,
              commentCount: post.commentCount ?? 0,
              shareCount: post.shareCount ?? 0,
              isLiked: post.isLiked ?? false,
              isShared: post.isShared ?? false,
            };
          });

          setPosts(mappedPosts);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error("Feed load failed", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-muted-foreground">
        Loading feed...
      </p>
    );
  }

  if (!posts.length) {
    return (
      <p className="text-center text-muted-foreground">
        No posts found
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <Post
          key={post._id} // ✅ real id
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
