"use client";

import { useState } from "react";
import { SignedImage } from "@/components/common/SignedImage";
import { VideoItem } from "../types/video";
import ReelPlayer from "../reel/ReelPlayer";
import ReelActions from "../reel/ReelActions";

export default function GeneralVideoCard({
  video,
}: {
  video: VideoItem;
}) {
  const media = video.medias?.[0];
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* 🔹 Author */}
      <div className="flex items-center gap-3 p-4">
        {video.author.avatar?.url && (
          <SignedImage
            url={video.author.avatar.url}
            keyPath={video.author.avatar.key}
            provider={video.author.avatar.provider}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}

        <div>
          <p className="font-semibold text-sm">{video.author.name}</p>
          <p className="text-xs text-gray-500">@{video.author.username}</p>
        </div>
      </div>

      {/* 🔹 Video Player (16:9) */}
      <div className="w-full aspect-video bg-black">
        <ReelPlayer media={media} active={true} /> {/* always active */}
      </div>

      {/* 🔹 Caption */}
      {video.text && (
        <p className="px-4 py-2 text-sm text-gray-800">{video.text}</p>
      )}

      {/* 🔹 Actions row */}
      <div className="px-4 py-2 border-t">
        <ReelActions
          reel={video}
          onCommentClick={() => setShowComments((prev) => !prev)}
        />
      </div>

      {/* 🔹 Inline comments placeholder */}
      {showComments && (
        <div className="px-4 pb-4 text-sm text-gray-500">
          Comments section here…
        </div>
      )}
    </div>
  );
}
