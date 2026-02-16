"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export function useReels() {
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await api.get("/videos/feed/reels", {
          params: { limit: 20 },
        });

        const items = res.data?.items || [];

        const mapped = items.map((item: any) => {
          const video = item.medias?.find((m: any) => m.type === "video");

          return {
            _id: item._id,
            text: item.text,
            likeCount: item.likeCount,
            commentCount: item.commentCount,
            shareCount: item.shareCount,
            isLiked: item.isLiked,
            createdAt: item.createdAt,
            video: video
              ? {
                  url: video.url,
                  key: video.key,
                  provider: video.provider,
                }
              : null,
            author: item.author,
          };
        });

        setReels(mapped);
      } catch (err) {
        console.error("Reels load failed", err);
        setReels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  return { reels, loading };
}
