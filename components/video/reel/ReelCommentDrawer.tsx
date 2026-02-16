"use client";

import { X} from "lucide-react";
import { SignedImage } from "@/components/common/SignedImage";
import CommentSection from "@/components/post/comment/CommentSection";

type Props = {
  open: boolean;
  onClose: () => void;
  reel: {
    _id: string;
    text?: string;
    author: {
      username: string;
      avatar?: { url?: string; key?: string; provider?: string };
    };
  };
};

export default function ReelCommentDrawer({ open, onClose, reel }: Props) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex justify-end">
      {/* backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* drawer */}
      <div className="w-full md:w-[420px] h-full bg-background flex flex-col">
        {/* HEADER */}
        <div className="p-4 border-b space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              {reel.author.avatar?.url && (
                <SignedImage
                  url={reel.author.avatar.url}
                  keyPath={reel.author.avatar.key}
                  provider={reel.author.avatar.provider}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}

              <div>
                <p className="font-semibold text-sm">
                  {reel.author.username}
                </p>

                {reel.text && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {reel.text}
                  </p>
                )}
              </div>
            </div>

            <button onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* COMMENT LIST */}
        <div className="flex-1 overflow-y-auto">
          <CommentSection postId={reel._id} />
        </div>
      </div>
    </div>
  );
}
