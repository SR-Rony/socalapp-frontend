"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

export type Comment = {
  _id: string;
  text: string;
  author: {
    _id: string;
    name: string;
    username: string;
    avatar?: any;
  };
  replyCount: number;
  createdAt: string;
};

type Props = {
  postId: string;
};

export default function CommentSection({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<any>(null);

  // 🔹 load comments
  const fetchComments = async () => {
    setLoading(true);
    const res = await api.get(`/comment/${postId}/comments`, {
      params: { cursor },
    });
    

    if (res.data.ok) {
      setComments((p) => [...p, ...res.data.items]);
      setCursor(res.data.nextCursor);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="mt-2 space-y-3">
      {/* input */}
      <CommentInput
        postId={postId}
        onAdd={(c) => setComments((p) => [c, ...p])}
      />

      {/* list */}
      {comments.map((c) => (
        <CommentItem key={c._id} comment={c} />
      ))}

      {/* load more */}
      {cursor && (
        <button
          disabled={loading}
          onClick={fetchComments}
          className="text-sm text-muted-foreground hover:underline"
        >
          Load more comments
        </button>
      )}
    </div>
  );
}
