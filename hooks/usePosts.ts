"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Media } from "@/components/post/Post";
import { PostData } from "@/components/post/types/post";

interface FeedAuthor {
  _id: string;
  name: string;
  username?: string;
  avatar?: Media;
  isMe?: boolean;
}

interface FeedItem {
  data: any; // 🔥 allow mixed shape (post + groupPost)
}

interface FeedResponse {
  success: boolean;
  items: FeedItem[];
}

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

            const isGroupPost = post.feedType === "groupPost";

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
              media: post.medias?.[0] || undefined,

              likeCount: post.likeCount ?? post.counts?.likeCount ?? 0,
              commentCount: post.commentCount ?? post.counts?.commentCount ?? 0,
              shareCount: post.shareCount ?? post.counts?.shareCount ?? 0,
              isLiked: post.isLiked,
              isShared: post.isShared,

              // 🔥 NEW
              isGroupPost,
              groupId: isGroupPost ? post.group?._id : undefined,
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

  return { posts, setPosts, loading };
}