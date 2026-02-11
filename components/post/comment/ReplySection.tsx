"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import CommentInput from "./CommentInput";

export default function ReplySection({
  postId,
  parentId,
  replyCount,
  onClose,
}: {
  postId: string;
  parentId: string;
  replyCount: number;
  onClose: () => void;
}) {
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch only when mounted
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/comment/${parentId}/replies`);
        setReplies(res.data.items);
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [parentId]);

  return (
    <div className="ml-10 mt-2 space-y-3">

      {/* Close Button */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <button onClick={onClose} className="hover:underline">
          Hide replies
        </button>
      </div>

      {/* Reply List */}
      {loading && (
        <p className="text-xs text-muted-foreground">Loading...</p>
      )}

      {replies.map((r) => (
        <div key={r._id} className="flex gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-300" />

          <div className="flex-1">
            <div className="rounded-2xl bg-muted px-3 py-2 text-sm">
              <span className="font-semibold">
                {r.author.name}
              </span>{" "}
              {r.text}
            </div>

            <div className="flex gap-3 text-xs text-muted-foreground mt-1">
              <button className="hover:underline">Like</button>
              <span>
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Reply Input */}
      <CommentInput
        postId={postId}
        parentId={parentId}
        onAdd={(c) => setReplies((p) => [...p, c])}
      />
    </div>
  );
}
