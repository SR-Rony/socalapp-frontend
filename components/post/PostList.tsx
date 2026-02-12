"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Post from "./Post";
import type { PostData, Media } from "./Post"; // ✅ import only

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
    medias?: {
      key?: string;
      url?: string;
      type: "image" | "video";
      provider?: string;
    }[];
    createdAt: string;
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

            // Map avatar
            const avatar: Media | undefined = post.author.avatar
              ? {
                  type: "image",
                  url: post.author.avatar.url || "",
                  key: post.author.avatar.key,
                  provider: post.author.avatar.provider,
                }
              : undefined;

            return {
              _id: post._id,
              authorId: post.author._id,
              user: {
                userId: post.author._id,
                name: post.author.name,
                avatar,
              },
              content: post.text,
              time: post.createdAt,
              media: post.medias?.[0] || null,
              likeCount: post.likeCount,
              commentCount: post.commentCount,
              shareCount: post.shareCount,
              isLiked: post.isLiked,
              isShared: post.isShared,
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
    return <p className="text-center text-muted-foreground">Loading feed...</p>;
  }

  if (!posts.length) {
    return <p className="text-center text-muted-foreground">No posts found</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
         <Post
            key={post._id}
            post={post}   // 👉 পুরো object একসাথে পাঠানো
            onEdit={(p) => console.log("Edit post:", p)}
            onDelete={(id) => console.log("Delete post:", id)}
          />
      ))}
    </div>
  );
}
