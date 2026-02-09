"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  postId: string;
  parentId?: string;
  onAdd: (comment: any) => void;
};

export default function CommentInput({ postId, parentId, onAdd }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!text.trim() || loading) return;

    try {
      setLoading(true);
      const res = await api.post(`/comment/${postId}/comments`, {
        text,
        parentId,
      });

      if (res.data.ok) {
        onAdd(res.data.comment);
        setText("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        className="flex-1 rounded-full"
      />

      <Button
        type="button"        // 🔥 MOST IMPORTANT
        onClick={submit}
        disabled={loading}
        size="sm"
        className="z-50 cursor-pointer"
      >
        Post
      </Button>
    </div>
  );
}
