"use client";

import { MessageCircle, ThumbsUp, Share2 } from "lucide-react";
import { useState } from "react";
import CommentSection from "./comment/CommentSection";
import CommentModal from "./comment/CommentModal";

type PostActionsProps = {
  postId: string;
  commentCount?: number;
  likeCount?: number;
};

export default function PostActions({
  postId,
  commentCount = 0,
  likeCount = 0,
}: PostActionsProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likeCount);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    // 🔥 later: backend call
    setLiked((p) => !p);
    setLikes((p) => (liked ? p - 1 : p + 1));
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
          onClick={() => setShowComments((p) => !p)}
          icon={<MessageCircle size={18} />}
          label="Comment"
        />

        <ActionButton
          onClick={() => {
            alert("Share coming soon");
          }}
          icon={<Share2 size={18} />}
          label="Share"
        />
      </div>

      {/* 🔥 Comment Section */}
      {showComments && (
        <div className="mt-3">
          <CommentSection postId={postId} />
        </div>
      )}
      <CommentModal
        open={showComments}
        onClose={() => setShowComments(false)}
        postId={postId}
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
