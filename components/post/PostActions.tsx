"use client";

import { MessageCircle, ThumbsUp, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import CommentModal from "./comment/CommentModal";
import { PostData } from "./types/post.ts";

type PostActionsProps = {
  post: PostData;
  commentCount?: number;
  likeCount?: number;
};

export default function PostActions({
  post,
  commentCount = 0,
  likeCount = 0,
}: PostActionsProps) {
  // 🔥 initialize from backend data
  const [liked, setLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);

  // 🔁 if post changes sync state
  useEffect(() => {
    setLiked(post.isLiked);
    setLikes(post.likeCount);
  }, [post]);

  const handleLike = () => {
    setLiked((prev) => !prev);

    setLikes((prev) => (liked ? prev - 1 : prev + 1));

    // 🔥 later: backend API call
  };

  const openComments = () => {
  setShowComments((prev) => {
    if (prev) return prev; // already open থাকলে কিছুই করবে না
    return true;
  });
};

  return (
    <div className="pt-2">
      {/* counts */}
      <div className="flex items-center justify-between px-1 pb-2 text-sm text-muted-foreground">
        <span>{likes > 0 && `${likes} likes`}</span>
        <span>{commentCount > 0 && `${commentCount} comments`}</span>
      </div>

      {/* actions */}
      <div className="flex justify-around border-t pt-1">
        <ActionButton
          active={liked}
          onClick={handleLike}
          icon={<ThumbsUp size={18} />}
          label="Like"
        />

        <ActionButton
          onClick={openComments}
          icon={<MessageCircle size={18} />}
          label="Comment"
        />

        <ActionButton
          onClick={() => alert("Share coming soon")}
          icon={<Share2 size={18} />}
          label="Share"
        />
      </div>

      {/* 🔥 Facebook Style Modal */}
      <CommentModal
        open={showComments}
        onClose={() => setShowComments(false)}
        post={post}
      />
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition cursor-pointer
        ${
          active
            ? "text-blue-600"
            : "text-muted-foreground hover:bg-muted"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}
