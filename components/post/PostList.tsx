"use client";

import { useEffect, useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import { useReels } from "@/hooks/useReels";
import Post from "./Post";
import ReelsPreviewRow from "../video/reel/ReelsPreviewRow";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { PostData, Media } from "./Post";

const REELS_INSERT_AFTER = 2;

export default function PostList() {
  // 🔹 fetch posts
  const { posts: apiPosts, loading } = usePosts();
  const { reels: allReels } = useReels();

  const [posts, setPosts] = useState<PostData[]>([]);
  const [reelsChunks, setReelsChunks] = useState<any[][]>([]);

  // ✏️ edit state
  const [editingPost, setEditingPost] = useState<PostData | null>(null);
  const [editText, setEditText] = useState("");

  // 🗑️ delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ===============================
  // 🎬 reels chunk split
  // ===============================
  useEffect(() => {
    if (!allReels.length) return;
    const chunks = [];
    for (let i = 0; i < allReels.length; i += 5) {
      chunks.push(allReels.slice(i, i + 5));
    }
    setReelsChunks(chunks);
  }, [allReels]);

  // ===============================
  // 🔹 sync api posts to local state
  // ===============================
  useEffect(() => {
    setPosts(apiPosts);
  }, [apiPosts]);

  // ===============================
  // ✏️ EDIT HANDLERS
  // ===============================
  const handleEdit = (post: PostData) => {
    setEditingPost(post);
    setEditText(post.content || "");
  };

  const handleEditSave = async () => {
    if (!editingPost) return;

    try {
      const res = await api.patch(`/posts/${editingPost._id}`, {
        text: editText,
      });

      const updatedPost: PostData = res.data.post;

      setPosts((prev) =>
        prev.map((p) =>
          p._id === updatedPost._id
            ? { ...p, content: updatedPost.content } // ✅ only content
            : p
        )
      );

      toast.success("Post updated");
      setEditingPost(null);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Update failed");
    }
  };

  // ===============================
  // 🗑️ DELETE HANDLERS
  // ===============================
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    const id = deletingId;

    // optimistic remove
    setPosts((prev) => prev.filter((p) => p._id !== id));
    setDeletingId(null);

    try {
      await api.delete(`/posts/${id}/delete`);
      toast.success("Post deleted");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  // ===============================
  // 🧩 MERGE FEED WITH REELS
  // ===============================
  if (loading)
    return <p className="text-center text-muted-foreground">Loading feed...</p>;

  if (!posts.length)
    return <p className="text-center text-muted-foreground">No posts found</p>;

  // merge feed
  const mergedFeed: (PostData | "REELS")[] = [];
  posts.forEach((post, index) => {
    mergedFeed.push(post);
    if ((index + 1) % REELS_INSERT_AFTER === 0) mergedFeed.push("REELS");
  });

  let reelsIndex = 0;

  return (
    <>
      <div className="flex flex-col gap-4">
        {mergedFeed.map((item, i) => {
          if (item === "REELS") {
            if (reelsIndex >= reelsChunks.length) return null;
            const reelsChunk = reelsChunks[reelsIndex];
            reelsIndex++;
            return <ReelsPreviewRow key={`reels-${i}`} reels={reelsChunk} />;
          }

          // 🔹 map API post to Post.tsx compatible shape
          const mappedPost: PostData = {
            ...item,
            user: {
              userId: item.user?.userId || item.authorId,
              name: item.user?.name || "Unknown",
              avatar: item.user?.avatar || undefined, // ✅ null -> undefined
            },
            media: item.media, // ✅ no more medias
            content: item.content || "", // ✅ no text
            likeCount: item.likeCount,
            commentCount: item.commentCount,
            shareCount: item.shareCount,
            isLiked: item.isLiked,
            isShared: item.isShared,
            isSaved: item.isSaved,
          };

          return (
            <Post
              key={mappedPost._id}
              post={mappedPost}
              onEdit={handleEdit}
              onDelete={(id) => setDeletingId(id)}
            />
          );
        })}
      </div>

      {/* ===================== */}
      {/* ✏️ EDIT DIALOG */}
      {/* ===================== */}
      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit post</DialogTitle>
          </DialogHeader>

          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[120px]"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPost(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===================== */}
      {/* 🗑️ DELETE DIALOG */}
      {/* ===================== */}
      <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete post?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            This will move your post to trash.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}