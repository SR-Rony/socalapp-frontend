"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import CommentSection from "./CommentSection";

type Props = {
  open: boolean;
  onClose: () => void;
  postId: string;
};

export default function CommentModal({ open, onClose, postId }: Props) {
  // 🔥 ESC key close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-10 flex h-[90vh] w-full max-w-xl flex-col rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Comments</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <CommentSection postId={postId} />
        </div>
      </div>
    </div>
  );
}
