"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import CommentSection from "./CommentSection";
import { SignedImage } from "@/components/common/SignedImage";
import PostMedia from "../PostMedia";
import PostActions from "../PostActions";

type Props = {
  open: boolean;
  onClose: () => void;
  post: any; // better: PostData
};

export default function CommentModal({ open, onClose, post }: Props) {
  // 🔥 ESC close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // prevent background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-10 flex h-[95vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Post</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>

        {/* 🔥 BODY (flex column layout) */}
        <div className="flex flex-1 flex-col overflow-hidden">

          {/* 🟢 POST CONTENT (top fixed) */}
          <div className="border-b px-4 py-4 space-y-4">

            {/* User Info */}
            <div className="flex items-center gap-3">
              {post.user.avatar?.url && (
                <SignedImage
                  keyPath={post.user.avatar.key}
                  url={post.user.avatar.url}
                  provider={post.user.avatar.provider}
                  alt={post.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium">{post.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {post.time}
                </p>
              </div>
            </div>

            {/* Content */}
            {post.content && (
              <p className="text-sm whitespace-pre-wrap">
                {post.content}
              </p>
            )}

            {/* Media */}
            {post.media && (
              <div className="w-full max-h-[400px] overflow-hidden rounded-lg">
                <PostMedia media={post.media} />
              </div>
            )}

            {/* Actions */}
            <PostActions
              post={post}
              likeCount={post.likeCount}
              commentCount={post.commentCount}
            />
          </div>

          {/* 🔥 COMMENTS SECTION (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-4">
            <CommentSection postId={post._id} />
          </div>

        </div>
      </div>
    </div>
  );
}
