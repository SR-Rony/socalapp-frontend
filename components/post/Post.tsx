"use client";

import { SignedImage } from "@/components/common/SignedImage";
import PostMedia from "./PostMedia";
import Link from "next/link";
import {
  Edit3,
  MoreHorizontal,
  Trash2,
  Bookmark,
  BookmarkCheck,
  Flag,
  Link2,
} from "lucide-react";
import { useAppSelector } from "@/redux/hook/hook";
import { useEffect, useRef, useState } from "react";
import PostActions from "./PostActions";
import api from "@/lib/api";
import { toast } from "sonner";

export type Media = {
  type: "image" | "video";
  key?: string;
  url?: string;
  provider?: string;
};

export type PostData = {
  _id: string;
  authorId: string;
  user: {
    userId: string;
    name: string;
    avatar?: Media; // Media | undefined ✅
  };
  time: string;
  content: string;
  media?: Media; // Media | undefined ✅

  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  isShared: boolean;

  isSaved?: boolean;
};

type PostProps = {
  post: PostData;
  onEdit?: (post: PostData) => void;
  onDelete?: (id: string) => void;
  onUnsave?: (id: string) => void;
  isSavedPage?: boolean;
};

export default function Post({
  post,
  onEdit,
  onDelete,
  onUnsave,
  isSavedPage = false,
}: PostProps) {
  const { user: me } = useAppSelector((state) => state.auth);

  if (!post || !post.user) return null;

  const avatar = post.user.userId === me?._id ? me?.avatar : post.user.avatar;
  const isMe = me?._id === post.user.userId;

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(post.isSaved ?? false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSaveToggle = async () => {
    if (saving) return;
    setSaving(true);
    try {
      if (!isSaved) {
        await api.post(`/posts/${post._id}/save`);
        setIsSaved(true);
        toast.success("Post saved");
      } else {
        await api.delete(`/posts/${post._id}/save`);
        setIsSaved(false);
        toast.success("Removed from saved");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
      setOpen(false);
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/posts/${post._id}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
    setOpen(false);
  };

  const handleReport = async () => {
    try {
      await api.post(`/report/posts/${post._id}`, { reason: "spam", details: "" });
      toast.success("Post reported");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Report failed");
    } finally {
      setOpen(false);
    }
  };

  const renderMenu = () => {
    if (isSavedPage) {
      return (
        <button
          onClick={() => onUnsave?.(post._id)}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition"
        >
          Remove from saved
        </button>
      );
    }

    return (
      <>
        {isMe ? (
          <>
            <button
              onClick={handleCopyLink}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition"
            >
              <Link2 size={18} />
              <span>Copy link</span>
            </button>

            <button
              onClick={() => { setOpen(false); onEdit?.(post); }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition"
            >
              <Edit3 size={18} className="text-muted-foreground" />
              <span>Edit post</span>
            </button>

            <button
              onClick={() => { setOpen(false); onDelete?.(post._id); }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <Trash2 size={18} />
              <span>Move to trash</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSaveToggle}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition"
            >
              {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              <span>{isSaved ? "Unsave post" : "Save post"}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition"
            >
              <Link2 size={18} />
              <span>Copy link</span>
            </button>

            <button
              onClick={handleReport}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <Flag size={18} />
              <span>Report post</span>
            </button>
          </>
        )}
      </>
    );
  };

  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.user.userId}`} className="w-10 h-10">
            {avatar?.url && (
              <SignedImage
                keyPath={avatar.key}
                url={avatar.url + "?v=" + Date.now()}
                provider={avatar.provider}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
          </Link>

          <div>
            <Link href={`/profile/${post.user.userId}`} className="font-medium hover:underline">
              {post.user.name}
            </Link>
            <p className="text-xs text-muted-foreground">{post.time}</p>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button onClick={() => setOpen(p => !p)} className="p-2 rounded-full hover:bg-muted transition">
            <MoreHorizontal size={18} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
              {renderMenu()}
            </div>
          )}
        </div>
      </div>

      {post.content && <p>{post.content}</p>}
      {post.media && <PostMedia media={post.media} />}

      <PostActions post={post} likeCount={post.likeCount} commentCount={post.commentCount} />
    </div>
  );
}