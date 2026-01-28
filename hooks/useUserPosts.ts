import { useState } from "react";

export const useUserPosts = (fetcher: Function) => {
  const [items, setItems] = useState<any[]>([]);
  const [cursor, setCursor] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const res = await fetcher({ cursor });
    setItems(prev => [...prev, ...res.data.items]);
    setCursor(res.data.nextCursor);
    setLoading(false);
  };

  return { items, loadMore, loading };
};
