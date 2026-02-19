"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Media } from "@/components/post/Post";
import { PostData } from "@/components/post/types/post";

// 👇 Author type
interface FeedAuthor {
  _id: string;
  name: string;
  username?: string;
  avatar?: Media;
  isFollowing?: boolean;
}

// 👇 Single feed item data
interface FeedItemData {
  _id: string;
  author: FeedAuthor;
  text: string;
  medias?: Media[];
  createdAt: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  isShared: boolean;
  category?: string;
  subCategory?: string;
  type?: string;
  videoMode?: string;
  viewCount?: number;
  loop?: boolean;
  mutedByDefault?: boolean;
  saveCount?: number;
  updatedAt?: string;
}

// 👇 Feed API response item
export interface FeedItem {
  data: FeedItemData;
}

// 👇 Full feed response
export interface FeedResponse {
  success: boolean;
  items: FeedItem[];
}

// 👇 Custom hook
export function usePosts() {
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

  return { posts, loading };
}
