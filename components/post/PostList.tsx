"use client";

import { useEffect, useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import { useReels } from "@/hooks/useReels";
import Post from "./Post";
import ReelsPreviewRow from "../video/reel/ReelsPreviewRow";
import api from "@/lib/api";
import { toast } from "sonner";
import type { PostData } from "./Post";
import PostEditDeleteDialogs from "./modal/PostEditDeleteDialogs";

const REELS_INSERT_AFTER = 2;

export default function PostList() {
  const { posts: apiPosts, loading } = usePosts();
  const { reels: allReels } = useReels();

  const [posts, setPosts] = useState<PostData[]>([]);
  const [reelsChunks, setReelsChunks] = useState<any[][]>([]);

  const [editingPost, setEditingPost] = useState<PostData | null>(null);
  const [editText, setEditText] = useState("");

  const [deletingTarget, setDeletingTarget] = useState<string | null>(null);

  // 🎬 reels split
  useEffect(() => {
    if (!allReels.length) return;
    const chunks = [];
    for (let i = 0; i < allReels.length; i += 5) {
      chunks.push(allReels.slice(i, i + 5));
    }
    setReelsChunks(chunks);
  }, [allReels]);

  useEffect(() => {
    setPosts(apiPosts);
  }, [apiPosts]);
  

  // ✏️ EDIT
  const handleEdit = (post: PostData) => {
    setEditingPost(post);
    setEditText(post.content || "");
  };

  const handleEditSave = async () => {
    if (!editingPost) return;

    try {
      const endpoint = editingPost.isGroupPost
        ? `/groups/${editingPost.groupId}/posts/${editingPost._id}`
        : `/posts/${editingPost._id}`;

      await api.patch(endpoint, { text: editText });

      setPosts((prev) =>
        prev.map((p) =>
          p._id === editingPost._id ? { ...p, content: editText } : p
        )
      );

      toast.success("Post updated");
      setEditingPost(null);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Update failed");
    }
  };

  // 🗑️ DELETE
  const handleDeleteConfirm = async () => {
    if (!deletingTarget) return;

    const post = posts.find((p) => p._id === deletingTarget);
    if (!post) return;

    const endpoint = post.isGroupPost
      ? `/groups/${post.groupId}/posts/${post._id}`
      : `/posts/${post._id}/delete`;

    // optimistic
    setPosts((prev) => prev.filter((p) => p._id !== post._id));
    setDeletingTarget(null);

    try {
      await api.delete(endpoint);
      toast.success("Post deleted");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  if (loading)
    return <p className="text-center text-muted-foreground">Loading feed...</p>;

  if (!posts.length)
    return <p className="text-center text-muted-foreground">No posts found</p>;

  // 🧩 merge reels
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
            const reelsChunk = reelsChunks[reelsIndex++];
            return <ReelsPreviewRow key={`reels-${i}`} reels={reelsChunk} />;
          }

          return (
            <Post
              key={item._id}
              post={item}
              onEdit={handleEdit}
              onDelete={(id) => setDeletingTarget(id)}
            />
          );
        })}
      </div>

      <PostEditDeleteDialogs
        editingPost={editingPost}
        editText={editText}
        setEditText={setEditText}
        onCloseEdit={() => setEditingPost(null)}
        onSaveEdit={handleEditSave}
        deletingId={deletingTarget}
        onCloseDelete={() => setDeletingTarget(null)}
        onConfirmDelete={handleDeleteConfirm}
      />
    </>
  );
}