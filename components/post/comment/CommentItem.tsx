"use client";

import { useState } from "react";
import CommentInput from "./CommentInput";
import ReplySection from "./ReplySection";

export default function CommentItem({ comment }: { comment: any }) {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="space-y-1">
      <div className="rounded-lg bg-muted px-3 py-2 text-sm">
        <span className="font-medium">{comment.author.name}</span>{" "}
        {comment.text}
      </div>

      <div className="flex gap-3 text-xs text-muted-foreground pl-2">
        <button onClick={() => setShowReplies((p) => !p)}>
          {comment.replyCount > 0
            ? `View replies (${comment.replyCount})`
            : "Reply"}
        </button>
      </div>

      {showReplies && (
        <ReplySection
          parentId={comment._id}
          postId={comment.postId}
        />
      )}
    </div>
  );
}
