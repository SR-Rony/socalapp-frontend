"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { Copy, Check, Facebook, Twitter, MessageCircle } from "lucide-react";

export default function ShareModal({
  open,
  onClose,
  onConfirm, // backend share API trigger
  videoId,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  videoId: string;
}) {
  const [copied, setCopied] = useState(false);
  const sharedRef = useRef(false); // prevent multiple count

  const videoUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/feed/videos/general/${videoId}`
      : "";

  /* =========================
     🔥 track share once
  ========================= */
  const trackShare = () => {
    if (sharedRef.current) return;
    sharedRef.current = true;
    onConfirm(); // call parent → API + optimistic update
  };

  /* =========================
     📋 Copy link
  ========================= */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl);
      setCopied(true);
      trackShare(); // ✅ count as share

      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy link");
    }
  };

  /* =========================
     🌐 Social share links
  ========================= */
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    videoUrl,
  )}`;

  const twitterShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    videoUrl,
  )}`;

  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(videoUrl)}`;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Share this video</DialogTitle>
        </DialogHeader>

        {/* 🔗 Copy link */}
        <div className="flex items-center gap-2 mt-3">
          <input
            value={videoUrl}
            readOnly
            className="flex-1 px-3 py-2 text-sm border rounded-md"
          />

          <button
            onClick={handleCopy}
            className="p-2 rounded-md border hover:bg-muted"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        {/* 🌐 Social icons */}
        <div className="flex justify-center gap-6 mt-6">
          {/* Facebook */}
          <a
            href={facebookShare}
            target="_blank"
            onClick={trackShare} // ✅ count
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1877F2] text-white">
              <Facebook size={22} />
            </div>
            <span className="text-xs">Facebook</span>
          </a>

          {/* X */}
          <a
            href={twitterShare}
            target="_blank"
            onClick={trackShare}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-black text-white">
              <Twitter size={22} />
            </div>
            <span className="text-xs">X</span>
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappShare}
            target="_blank"
            onClick={trackShare}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#25D366] text-white">
              <MessageCircle size={22} />
            </div>
            <span className="text-xs">WhatsApp</span>
          </a>
        </div>

        {/* ✅ Confirm share */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              trackShare();
              onClose();
            }}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white"
          >
            Share
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}