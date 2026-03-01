"use client";

import { SignedImage } from "@/components/common/SignedImage";
import PostMedia from "./PostMedia";
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
import { useEffect, useRef, useState, useMemo } from "react";
import PostActions from "./PostActions";
import api from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

/* -------------------------
   🔹 Types
------------------------- */
export type Media = {
  type: "image" | "video";
  key?: string;
  url?: string;
  provider?: string;
};

export type PostData = {
  _id: string;
  authorId: string; // always string
  user: {
    userId: string; // always string
    name: string;
    avatar?: Media;
  };
  time: string;
  content: string;
  media?: Media;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  isShared: boolean;
  isSaved?: boolean;
  isGroupPost?: boolean;
  groupId?: string;
};

type PostProps = {
  post: PostData | any; // incoming raw post may have object IDs
  onEdit?: (post: PostData) => void;
  onDelete?: (id: string) => void;
  onUnsave?: (id: string) => void;
  isSavedPage?: boolean;
  isGroupContext?: boolean;
};

/* -------------------------
   🔹 Component
------------------------- */
export default function Post({
  post,
  onEdit,
  onDelete,
  onUnsave,
  isSavedPage = false,
}: PostProps) {
  const { user: me } = useAppSelector((state) => state.auth);

  if (!post || !post.user) return null;

  /* -------------------------
     🔧 Normalize IDs (always string)
  ------------------------- */
  const authorId = useMemo(
    () =>
      typeof post.authorId === "string"
        ? post.authorId
        : (post.authorId as { _id: string })?._id || "",
    [post.authorId]
  );

  const userId = useMemo(
    () =>
      typeof post.user?.userId === "string"
        ? post.user.userId
        : (post.user.userId as { _id: string })?._id || authorId,
    [post.user?.userId, authorId]
  );

  /* -------------------------
     👤 Avatar logic
  ------------------------- */
  const avatar = userId === me?._id ? me?.avatar : post.user.avatar;

  /* -------------------------
     🔐 Permissions
  ------------------------- */
  const isMe = me?._id === authorId;
  const canEditDelete = isMe;

  /* -------------------------
     📦 Normalized post for PostActions
  ------------------------- */
  const normalizedPost: PostData = {
    ...post,
    authorId,
    user: {
      ...post.user,
      userId,
    },
  };

  /* -------------------------
     📂 Menu state
  ------------------------- */
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

  /* -------------------------
     💾 Save / Unsave
  ------------------------- */
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

  /* -------------------------
     🔗 Copy link
  ------------------------- */
  const handleCopyLink = async () => {
    const url = `${window.location.origin}/posts/${post._id}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
    setOpen(false);
  };

  /* -------------------------
     🚩 Report
  ------------------------- */
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

  /* -------------------------
     📋 Menu render
  ------------------------- */
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

    if (canEditDelete) {
      return (
        <>
          <MenuBtn icon={<Link2 size={18} />} label="Copy link" onClick={handleCopyLink} />
          <MenuBtn
            icon={<Edit3 size={18} />}
            label="Edit post"
            onClick={() => {
              setOpen(false);
              onEdit?.(normalizedPost);
            }}
          />
          <MenuBtn
            icon={<Trash2 size={18} />}
            label="Move to trash"
            danger
            onClick={() => {
              setOpen(false);
              onDelete?.(normalizedPost._id);
            }}
          />
        </>
      );
    }

    return (
      <>
        <MenuBtn
          icon={isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          label={isSaved ? "Unsave post" : "Save post"}
          onClick={handleSaveToggle}
        />
        <MenuBtn icon={<Link2 size={18} />} label="Copy link" onClick={handleCopyLink} />
        <MenuBtn icon={<Flag size={18} />} label="Report post" danger onClick={handleReport} />
      </>
    );
  };

  /* -------------------------
     🎨 UI
  ------------------------- */
  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href={userId ? `/profile/${userId}` : "#"} className="w-10 h-10">
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
            <Link href={userId ? `/profile/${userId}` : "#"} className="font-medium hover:underline">
              {post.user.name}
            </Link>
            <p className="text-xs text-muted-foreground">{post.time}</p>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((p) => !p)}
            className="p-2 rounded-full hover:bg-muted transition"
          >
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

      <PostActions
        post={normalizedPost}
        likeCount={post.likeCount}
        commentCount={post.commentCount}
      />
    </div>
  );
}

/* -------------------------
   🔘 Reusable Menu Button
------------------------- */
function MenuBtn({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition hover:bg-muted ${
        danger ? "text-red-600 hover:bg-red-50" : ""
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}