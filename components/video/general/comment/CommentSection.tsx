"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import CommentItem from "./CommentItem";

type Comment = {
  _id: string;
  text: string;
  author: {
    username: string;
    avatar?: { url?: string; key?: string; provider?: string };
  };
  createdAt: string;
  replyCount?: number;
};

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  // 📥 fetch comments
  const fetchComments = async (next = false) => {
    if (!hasMore && next) return;

    const res = await api.get(`/comment/${postId}/comments`, {
      params: next && cursor ? { cursor: JSON.stringify(cursor) } : {},
    });

    const newItems = res.data.items || [];

    setComments(prev => (next ? [...prev, ...newItems] : newItems));
    setCursor(res.data.nextCursor);
    setHasMore(!!res.data.nextCursor);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // ➕ create comment
  const handleCreate = async () => {
    if (!text.trim()) return;

    setLoading(true);

    const res = await api.post(`/comment/${postId}/comments`, { text });

    setComments(prev => [res.data.comment, ...prev]);
    setText("");
    setLoading(false);
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">
        {comments.length} Comments
      </h2>

      {/* ✍️ Add comment */}
      <div className="flex gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-muted" />

        <div className="flex-1">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Add a comment..."
            className="w-full border-b bg-transparent outline-none pb-1"
          />

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setText("")}
              className="text-sm text-muted-foreground"
            >
              Cancel
            </button>

            <button
              onClick={handleCreate}
              disabled={loading}
              className="bg-black text-white px-4 py-1.5 rounded-full text-sm"
            >
              Comment
            </button>
          </div>
        </div>
      </div>

      {/* 💬 Comment list */}
      <div className="flex flex-col gap-6">
        {comments.map(c => (
          <CommentItem key={c._id} comment={c} postId={postId} />
        ))}
      </div>

      {/* ⬇ load more */}
      {hasMore && (
        <button
          onClick={() => fetchComments(true)}
          className="mt-6 text-sm text-blue-600"
        >
          Load more
        </button>
      )}
    </div>
  );
}