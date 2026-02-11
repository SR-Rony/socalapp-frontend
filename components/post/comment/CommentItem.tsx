"use client";

import { useState } from "react";
import ReplySection from "./ReplySection";
import { MoreHorizontal, Edit3, Trash2, Flag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CommentItem({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onReport,
}: {
  comment: any;
   currentUserId: string; // ✅ string type
  onEdit?: (comment: any) => void;
  onDelete?: (comment: any) => void;
  onReport?: (comment: any) => void;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const hasReplies = comment.replyCount > 0;
  const isOwner = comment.author._id === currentUserId;

  console.log("comment",comment);
  

  return (
    <div className="flex gap-3 relative group">
      {/* Avatar */}
      <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gray-300" />

      <div className="flex-1 space-y-1">
        {/* Bubble */}
        <div className="relative rounded-2xl bg-muted px-4 py-2 text-sm">
          <span className="font-semibold">{comment.author.name}</span>
          <p className={comment.isDeleted ? "italic text-gray-400" : ""}>
            {comment.text}
          </p>

          {/* 🔹 Three dots menu */}
          {!comment.isDeleted && (
            <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 transition">
              <DropdownMenu>
                <DropdownMenuTrigger className="p-1 rounded-full hover:bg-gray-200">
                  <MoreHorizontal size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  {comment.author._id === currentUserId ? (
                    <>
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() => onEdit?.(comment)}
                      >
                        <Edit3 size={14} /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() => onDelete?.(comment)}
                      >
                        <Trash2 size={14} /> Delete
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={() => onReport?.(comment)}
                    >
                      <Flag size={14} /> Report
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>


        {/* Actions */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <button className="hover:underline">Like</button>
          <button
            onClick={() => setShowReplies((p) => !p)}
            className="hover:underline"
          >
            Reply
          </button>
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Facebook Style View Replies */}
        {hasReplies && !showReplies && (
          <button
            onClick={() => setShowReplies(true)}
            className="text-xs text-muted-foreground hover:underline ml-2"
          >
            {comment.replyCount === 1
              ? "View reply"
              : `View replies (${comment.replyCount})`}
          </button>
        )}

        {/* Replies */}
        {showReplies && (
          <ReplySection
            parentId={comment._id}
            postId={comment.postId}
            replyCount={comment.replyCount}
            onClose={() => setShowReplies(false)}
          />
        )}
      </div>
    </div>
  );
}
