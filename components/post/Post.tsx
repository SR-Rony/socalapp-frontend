"use client";

import { SignedImage } from "@/components/common/SignedImage";
import PostMedia from "./PostMedia";
import Link from "next/link";
import { Edit3, MoreHorizontal, Trash2 } from "lucide-react";
import { useAppSelector } from "@/redux/hook/hook";
import { useEffect, useRef, useState } from "react";

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
    avatar?: Media;
  };
  time: string;
  content: string;
  media?: Media | null;
};

type PostProps = PostData & {
  onEdit: (post: PostData) => void;
  onDelete: (id: string) => void;
};

export default function Post({
  _id,
  authorId,
  user,
  time,
  content,
  media,
  onEdit,
  onDelete,
}: PostProps) {
  const { user: me } = useAppSelector((state) => state.auth);
  const avatar = user.userId === me?._id ? me.avatar : user.avatar;
  const isMe = me?._id === user.userId;

  const [open, setOpen] = useState(false);
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

  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      {/* header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${user.userId}`} className="w-10 h-10">
            {avatar?.url && (
              <SignedImage
                keyPath={avatar.key}
                url={avatar.url+"?v=" + Date.now()}
                provider={avatar.provider}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
          </Link>

          <div>
            <Link
              href={`/profile/${user.userId}`}
              className="font-medium hover:underline"
            >
              {user.name}
            </Link>
            <p className="text-xs text-muted-foreground">{time}</p>
          </div>
        </div>

        {isMe && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((p) => !p)}
              className="p-2 rounded-full hover:bg-muted"
            >
              <MoreHorizontal size={18} />
            </button>

            {open && (
              <div className="absolute right-0 mt-1 w-40 rounded-md border bg-white shadow z-20">
                <button
                  onClick={() => {
                    onEdit({ _id, authorId, user, time, content, media });
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <Edit3 size={16} />
                  Edit post
                </button>

                <button
                  onClick={() => {
                    onDelete(_id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-muted"
                >
                  <Trash2 size={16} />
                  Delete post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* content */}
      {content && <p>{content}</p>}
      {media && <PostMedia media={media} />}
    </div>
  );
}
