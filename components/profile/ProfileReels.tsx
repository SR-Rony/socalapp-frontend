import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ProfileReels({ userId }: { userId: string }) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get(`/users/${userId}/reels`).then((res) => {
      if (res.data?.success) {
        setItems(res.data.items);
      }
    });
  }, [userId]);

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((r) => (
        <video
          key={r._id}
          src={r.medias?.[0]?.url}
          controls
          className="rounded-xl"
        />
      ))}
    </div>
  );
}
