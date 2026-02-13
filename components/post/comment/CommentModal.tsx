"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CommentSection from "./CommentSection";
import { SignedImage } from "@/components/common/SignedImage";
import PostMedia from "../PostMedia";
import { PostData } from "../types/post.ts";

type Props = {
  open: boolean;
  onClose: () => void;
  post: PostData;
};

export default function CommentModal({ open, onClose, post }: Props) {
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-2xl h-[95vh] p-0 flex flex-col">

        {/* 🔝 Header */}
        <DialogHeader className="border-b px-4 py-3">
          <DialogTitle>Post</DialogTitle>
        </DialogHeader>

        {/* 🔽 Body */}
        <div className="flex flex-1 flex-col overflow-hidden">

          {/* 🟢 Post Content */}
          <div className="border-b px-4 py-4 space-y-4">

            {/* 👤 User */}
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

            {/* 📝 Content */}
            {post.content && (
              <p className="text-sm whitespace-pre-wrap">
                {post.content}
              </p>
            )}

            {/* 🖼 Media */}
            {post.media && (
              <div className="w-full max-h-[400px] overflow-hidden rounded-lg">
                <PostMedia media={post.media} />
              </div>
            )}

            {/* 👍 Counts (no comment button inside modal) */}
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
              <span>{post.likeCount > 0 && `${post.likeCount} likes`}</span>
              <span>{post.commentCount > 0 && `${post.commentCount} comments`}</span>
            </div>
          </div>

          {/* 💬 Comments list */}
          <div className="flex-1 overflow-y-auto px-4">
            <CommentSection postId={post._id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
