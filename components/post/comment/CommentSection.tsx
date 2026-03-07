"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import api from "@/lib/api";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { useAppSelector } from "@/redux/hook/hook";

export type Comment = {
  _id: string;
  text: string;
  postId: string;
  isGroupPost:boolean;
  author: {
    _id: string;
    name: string;
    username: string;
    avatar?: any;
  };
  replyCount: number;
  createdAt: string;
};

type Props = {
  postId: string;
  isGroupPost:boolean;
};

type UserType = {
  _id: string;
  name: string;
  role?: string;
  avatar?: {
    key?: string;
    url?: string;
    provider?: string;
  };
};

export default function CommentSection({ postId,isGroupPost }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // 🔹 Refs for stable loading & hasMore state
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const cursorRef = useRef<string | null>(null);

  const { user } = useAppSelector((state) => state.auth) as { user: UserType | null };
  

  // Update refs when state changes
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    cursorRef.current = cursor;
  }, [cursor]);

  // 🔹 Fetch comments safely
const fetchComments = useCallback(async () => {
  if (loadingRef.current || !hasMoreRef.current) return;

  const type = isGroupPost ? "groupPost" : "post";
  
  

  try {
    loadingRef.current = true;
    setLoading(true);

    const res = await api.get(`/comment/${postId}/comments`, {
      params: {
        cursor: cursorRef.current,
        type,
      },
    });

    if (res.data.ok) {
      const items: Comment[] = res.data.items || [];

      setComments((prev) => {
        const newItems = items.filter(
          (item) => !prev.some((p) => p._id === item._id)
        );
        return [...prev, ...newItems];
      });

      const next = res.data.nextCursor || null;
      setCursor(next);
      cursorRef.current = next;
      hasMoreRef.current = Boolean(next);
      setHasMore(Boolean(next));
    }
  } catch (err) {
    console.error("Failed to load comments", err);
  } finally {
    loadingRef.current = false;
    setLoading(false);
  }
}, [postId, isGroupPost]);

  // 🔹 Reset when post changes
  useEffect(() => {
    setComments([]);
    setCursor(null);
    setHasMore(true);
    cursorRef.current = null;
    hasMoreRef.current = true;

    fetchComments(); // Load first page
  }, [postId, fetchComments]);

  // 🔹 Safe add comment (no duplicate)
  const handleAddComment = (newComment: Comment) => {
    setComments((prev) =>
      prev.some((c) => c._id === newComment._id)
        ? prev
        : [newComment, ...prev]
    );
  };

  const handleEditComment = (comment: Comment) => {
    console.log("Edit comment", comment);
    // open modal or inline edit logic
  };

  const handleDeleteComment = async (comment: Comment) => {
    try {
      // 🔹 API call
      const res = await api.delete(`/comment/${comment._id}`);
      if (!res.data.ok) {
        console.error("Delete failed:", res.data.message);
        return;
      }

      // 🔹 Update frontend state (soft delete)
      setComments((prev) =>
        prev.map((c) =>
          c._id === comment._id
            ? {
                ...c,
                text: "[deleted]",
                isDeleted: true, // new flag
              }
            : c
        )
      );
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  };

  const handleReportComment = (comment: Comment) => {
    console.log("Report comment", comment);
    // send report to backend
  };

  return (
  <div className="flex h-full flex-col">

    {/* 🔥 Fixed Bottom Input */}
      <div className=" py-3">
        <CommentInput isGroupPost = {isGroupPost} postId={postId} onAdd={handleAddComment} />
      </div>

      {/* 🔥 Scrollable Comment List */}
      <div className="flex-1 space-y-4 overflow-y-auto py-4">
        {comments.map((c) => (
          <CommentItem
            key={c._id}
            isGroupPost = {isGroupPost}
            comment={c}
            currentUserId={user?._id || ""}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
            onReport={handleReportComment}
          />
        ))}

        {hasMore && ( 
          <button 
          disabled={loading} 
          onClick={fetchComments} 
          className="text-sm text-blue-600 hover:underline disabled:opacity-50 flex items-center gap-2 cursor-pointer" > 
          Load more comments 
          {loading && ( 
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" /> )} 
          </button> )}
      </div>
    </div>
  );

  }
