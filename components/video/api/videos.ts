import api from "@/lib/api";

export const fetchVideoFeed = async ({
  type, // "reels" | "general"
  cursor,
  limit = 5,
}: {
  type: "reels" | "general";
  cursor?: any;
  limit?: number;
}) => {
  const endpoint =
    type === "reels" ? "/videos/feed/reels" : "/videos/feed/general";

  const res = await api.get(endpoint, {
    params: {
      limit,
      cursor: cursor ? JSON.stringify(cursor) : undefined,
    },
  });

  return res.data;
};
