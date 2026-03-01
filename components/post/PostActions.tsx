"use client";

import { MessageCircle, ThumbsUp, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import CommentModal from "./comment/CommentModal";
import api from "@/lib/api";
// import { PostData } from "./types/post.ts";
import ShareModal from "./share/ShareModal";
import { PostData } from "./types/post";

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
  const [liked, setLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likeCount);
  const [shared, setShared] = useState(post.isShared);
  const [shares, setShares] = useState(post.shareCount);
  const [showComments, setShowComments] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingShare, setLoadingShare] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  console.log("post action",post);
  

  useEffect(() => {
    setLiked(post.isLiked);
    setLikes(post.likeCount);
    setShared(post.isShared);
    setShares(post.shareCount);
  }, [post]);

  // ❤️ LIKE
  const handleLike = async () => {
    if (loadingLike) return;
    setLoadingLike(true);

    const prevLiked = liked;

    // 🔥 optimistic UI
    setLiked(!prevLiked);
    setLikes((p) => (prevLiked ? p - 1 : p + 1));

    try {
      if (prevLiked) {
        await api.delete(`/posts/${post._id}/like`);
      } else {
        await api.post(`/posts/${post._id}/like`);
      }
    } catch (err) {
      // ❌ rollback
      setLiked(prevLiked);
      setLikes((p) => (prevLiked ? p + 1 : p - 1));
    } finally {
      setLoadingLike(false);
    }
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  // 🔁 SHARE
  const handleConfirmShare = async () => {
    if (loadingShare || shared) return;

    setLoadingShare(true);

    // optimistic
    setShared(true);
    setShares((p) => p + 1);

    try {
      await api.post(`/posts/${post._id}/share`);
    } catch (err) {
      setShared(false);
      setShares((p) => p - 1);
    } finally {
      setLoadingShare(false);
      setShowShareModal(false);
    }
  };



  const openComments = () => {
    setShowComments((prev) => {
      if (prev) return prev;
      return true;
    });
  };

  return (
    <div className="pt-2">
      {/* counts */}
      <div className="flex items-center justify-between px-1 pb-2 text-sm text-muted-foreground">
        <span>{likes > 0 && `${likes} likes`}</span>
        <div className="flex gap-2">
          <span>{commentCount > 0 && `${commentCount} comments`}</span>
          <span>{shares > 0 && `${shares} shares`}</span>
        </div>
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
          active={shared}
          onClick={handleShareClick}
          icon={<Share2 size={18} />}
          label="Share"
        />
      </div>
    {/* comment modal */}
      <CommentModal
        open={showComments}
        onClose={() => setShowComments(false)}
        post={post}
      />

      {/* share modal */}
      <ShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        onConfirm={handleConfirmShare}
        videoId={post._id}
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
        ${active ? "text-blue-600" : "text-muted-foreground hover:bg-muted"}`}
    >
      {icon}
      {label}
    </button>
  );
}
