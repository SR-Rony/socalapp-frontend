import { useEffect, useState } from "react";
import api from "@/lib/api";
import { SignedImage } from "@/components/common/SignedImage";

export default function ProfilePhotos({ userId }: { userId: string }) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.get(`/users/${userId}/photos`).then((res) => {
      if (res.data?.success) {
        setItems(res.data.items);
      }
    });
  }, [userId]);

  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((p) => (
        <div key={p._id} className="relative aspect-square rounded-lg overflow-hidden">
          <SignedImage
            keyPath={p.medias?.[0]?.key}
            url={p.medias?.[0]?.url}
            provider={p.medias?.[0]?.provider}
            alt="photo"
          />
        </div>
      ))}
    </div>
  );
}
