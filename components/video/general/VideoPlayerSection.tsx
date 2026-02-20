"use client";

import { useState } from "react";
import { MessageCircle, Share2, ThumbsUp } from "lucide-react";
import api from "@/lib/api";
import ShareModal from "@/components/post/share/ShareModal";
import { SignedVideo } from "@/components/common/SignedVideo";
import { SignedImage } from "@/components/common/SignedImage";
import CommentSection from "@/components/post/comment/CommentSection";
import type { VideoItem } from "../types/video";

export default function VideoPlayerSection({
  video,
}: {
  video: VideoItem;
}) {
  const media = video.medias?.[0];
  if (!media) return null;

  const [liked, setLiked] = useState(video.isLiked ?? false);
  const [likes, setLikes] = useState(video.likeCount ?? 0);
  const [loadingLike, setLoadingLike] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleLike = async () => {
    if (loadingLike) return;
    setLoadingLike(true);

    const prevLiked = liked;

    // 🔥 optimistic UI
    setLiked(!prevLiked);
    setLikes((p) => (prevLiked ? p - 1 : p + 1));

    try {
      if (prevLiked) {
        await api.delete(`/posts/${video._id}/like`);
      } else {
        await api.post(`/posts/${video._id}/like`);
      }
    } catch {
      // rollback
      setLiked(prevLiked);
      setLikes((p) => (prevLiked ? p + 1 : p - 1));
    } finally {
      setLoadingLike(false);
    }
  };

  return (
    <>
      {/* 🎬 Player */}
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
        <SignedVideo
          key={media.key}
          url={media.url}
          keyPath={media.key}
          provider={media.provider}
          mode="feed"
        />
      </div>

      {/* 📝 Title */}
      <h1 className="text-lg font-semibold mt-4">
        {video.text || "Untitled video"}
      </h1>

      <div className="flex justify-between items-center">
        {/* 👤 Channel row */}
        <div className="flex gap-2 mt-3">
          <div className="flex items-center gap-3">
            <SignedImage
              url={video.author?.avatar?.url}
              keyPath={video.author?.avatar?.key}
              provider={video.author?.avatar?.provider}
              className="w-10 h-10 rounded-full"
            />

            <div>
              <p className="text-sm font-medium">
                {video.author?.username}
              </p>
              <p className="text-xs text-muted-foreground">
                {video.viewCount} views
              </p>
            </div>
          </div>

          <button className="bg-black text-white text-sm px-4 py-1.5 rounded-full">
            Subscribe
          </button>
        </div>

        {/* 🔥 Actions Row */}
        <div className="flex items-center gap-6 mt-4">
          {/* 👍 Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 cursor-pointer ${
              liked ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <ThumbsUp className={liked ? "fill-primary" : ""} size={20} />
            <span>{likes}</span>
          </button>

          {/* 💬 Comment count only */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageCircle size={20} />
            <span>{video.commentCount}</span>
          </div>

          {/* 🔗 Share */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 text-muted-foreground cursor-pointer"
          >
            <Share2 size={20} />
            <span>{video.shareCount}</span>
          </button>
        </div>
      </div>

      {/* 💬 Comment Section */}
      <div className="mt-6">
        <CommentSection postId={video._id} />
      </div>

      <ShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        onConfirm={() => alert("confirm")}
      />
    </>
  );
}