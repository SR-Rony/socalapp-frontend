"use client";

import { useEffect, useState } from "react";
import { groupPostService } from "@/services/groupPost.service";

export function useGroupPosts(groupId: string) {
  const [posts, setPosts] = useState<any[]>([]);
  const [cursor, setCursor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (!groupId || loading || !hasMore) return;

    setLoading(true);

    const res = await groupPostService.getPosts(groupId, {
      cursor,
    });

    const items = res.data.items || [];

    setPosts((p) => [...p, ...items]);
    setCursor(res.data.nextCursor);
    setHasMore(!!res.data.nextCursor);

    setLoading(false);
  };

  const refresh = () => {
    setPosts([]);
    setCursor(null);
    setHasMore(true);
  };

  useEffect(() => {
    refresh();
  }, [groupId]);

  useEffect(() => {
    loadMore();
  }, [groupId]);

  return {
    posts,
    loadMore,
    loading,
    hasMore,
    refresh,
  };
}
