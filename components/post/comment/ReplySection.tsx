"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import CommentInput from "./CommentInput";

export default function ReplySection({
  postId,
  parentId,
}: {
  postId: string;
  parentId: string;
}) {
  const [replies, setReplies] = useState<any[]>([]);

  useEffect(() => {
    api
      .get(`/comment/${parentId}/replies`)
      .then((res) => setReplies(res.data.items));
  }, []);

  return (
    <div className="pl-6 space-y-2">
      {replies.map((r) => (
        <div
          key={r._id}
          className="rounded-lg bg-muted px-3 py-2 text-sm"
        >
          <span className="font-medium">{r.author.name}</span>{" "}
          {r.text}
        </div>
      ))}

      <CommentInput
        postId={postId}
        parentId={parentId}
        onAdd={(c) => setReplies((p) => [...p, c])}
      />
    </div>
  );
}
