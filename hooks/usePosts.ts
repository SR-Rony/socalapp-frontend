"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Media } from "@/components/post/Post";
import { PostData } from "@/components/post/types/post";

interface FeedItem {
  data: any;
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
            const isGroupPost = post.feedType === "groupPost";

            // ✅ avatar normalize
            const avatar: Media | undefined = post.author?.avatar
              ? {
                  type: "image",
                  url: post.author.avatar.url || "",
                  key: post.author.avatar.key,
                  provider: post.author.avatar.provider,
                }
              : undefined;

            // ✅ TEXT normalize
            const content = isGroupPost ? post.caption : post.text;

            // ✅ MEDIA normalize
            let media: Media | undefined;

            if (isGroupPost) {
              if (post.images?.length) {
                const img = post.images[0];
                media = {
                  type: "image",
                  url: img.url,
                  key: img.key,
                  provider: img.provider,
                };
              } else if (post.video) {
                media = {
                  type: "video",
                  url: post.video.url,
                  key: post.video.key,
                  provider: post.video.provider,
                };
              }
            } else {
              media = post.medias?.[0];
            }

            // ✅ COUNTS normalize (group + normal)
            const likeCount =
              post.likeCount ?? post.counts?.likeCount ?? 0;

            const commentCount =
              post.commentCount ?? post.counts?.commentCount ?? 0;

            const shareCount =
              post.shareCount ?? post.counts?.shareCount ?? 0;

            return {
              _id: post._id,
              authorId: post.author._id,

              user: {
                userId: post.author._id,
                name: post.author.name,
                avatar,
              },

              content,
              time: post.createdAt,
              media,

              likeCount,
              commentCount,
              shareCount,

              isLiked: post.isLiked ?? false,
              isShared: post.isShared ?? false,

              // 🔥 group info
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