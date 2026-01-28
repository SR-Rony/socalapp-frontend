"use client";

import { useEffect } from "react";
import PostCard from "@/components/post/PostCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export default function ProfileFeed({
  loader,
}: {
  loader: (params?: any) => Promise<any>;
}) {
  const [items, setItems] = React.useState<any[]>([]);
  const [cursor, setCursor] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);

    const res = await loader({ cursor });
    setItems(prev => [...prev, ...res.data.items]);
    setCursor(res.data.nextCursor);
    setLoading(false);
  };

  useEffect(() => {
    loadMore();
  }, []);

  const ref = useInfiniteScroll(() => {
    if (cursor) loadMore();
  });

  return (
    <div className="space-y-4">
      {items.map(post => (
        <PostCard key={post._id} post={post} />
      ))}

      {cursor && (
        <div ref={ref} className="h-10 flex justify-center">
          <span className="text-sm text-muted-foreground">
            Loading more...
          </span>
        </div>
      )}

      {!cursor && items.length === 0 && (
        <p className="text-center text-muted-foreground">
          No content found
        </p>
      )}
    </div>
  );
}
