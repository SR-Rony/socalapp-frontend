"use client";

import { MessageCircle, Heart, Share2 } from "lucide-react";
import { useState } from "react";
import api from "@/lib/api";
import ShareModal from "@/components/post/share/ShareModal";

type ReelActionsProps = {
  reel: {
    _id: string;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    isLiked: boolean;
  };
  onCommentClick: () => void;
};

export default function ReelActions({ reel, onCommentClick }: ReelActionsProps) {
  const [liked, setLiked] = useState(reel.isLiked);
  const [likes, setLikes] = useState(reel.likeCount);
  const [loadingLike, setLoadingLike] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleLike = async () => {
    if (loadingLike) return;
    setLoadingLike(true);

    const prevLiked = liked;

    // optimistic
    setLiked(!prevLiked);
    setLikes((p) => (prevLiked ? p - 1 : p + 1));

    try {
      if (prevLiked) {
        await api.delete(`/posts/${reel._id}/like`);
      } else {
        await api.post(`/posts/${reel._id}/like`);
      }
    } catch {
      setLiked(prevLiked);
      setLikes((p) => (prevLiked ? p + 1 : p - 1));
    } finally {
      setLoadingLike(false);
    }
  };

  //share modal
  const handleShareClick = () => {
    setShowShareModal(true);
  };

  //handleConfirmShare
  const handleConfirmShare =()=>{
    alert("confirm")
    
  }

  return (
    <>
      <div className="flex flex-col items-center gap-5 text-white">
        {/* ❤️ LIKE */}
        <button onClick={handleLike} className="flex flex-col items-center">
          <Heart size={28} className={liked ? "fill-red-500 text-red-500" : ""} />
          {likes > 0 && <span className="text-sm">{likes}</span>}
        </button>

        {/* 💬 COMMENT */}
        <button onClick={onCommentClick} className="flex flex-col items-center">
          <MessageCircle size={28} />
          {reel.commentCount > 0 && (
            <span className="text-sm">{reel.commentCount}</span>
          )}
        </button>

        {/* 🔗 SHARE */}
        <button className="flex flex-col items-center"
        onClick={handleShareClick}
        >
          <Share2 size={28} />
          {reel.shareCount > 0 && (
            <span className="text-sm">{reel.shareCount}</span>
          )}
        </button>
      </div>
      <ShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        onConfirm={handleConfirmShare}
      />
    </>
  );
}
