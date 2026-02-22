"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Post from "@/components/post/Post";

export default function SavedPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // =========================
  // 📡 FETCH SAVED POSTS
  // =========================
  const fetchSaved = async (pageNumber = 1, append = false) => {
    try {
      if (!append) setLoading(true);

      const res = await api.get(
        `/posts/me/saved/list?page=${pageNumber}&limit=10`
      );

      const newPosts = res.data.posts || [];

      // 🔹 Map API response to Post.tsx compatible shape
      const mappedPosts = newPosts.map((item: any) => ({
        _id: item._id,
        user: {
          userId: item.author?._id || item.authorId,
          name: item.author?.name || item.author?.username || "Unknown",
          avatar: item.author?.avatar
            ? {
                type: item.author.avatar.type,
                url: item.author.avatar.url,
                key: item.author.avatar.key,
                provider: item.author.avatar.provider,
              }
            : undefined,
        },
        content: item.text || item.description || "",
        media: item.media || (item.medias?.length ? item.medias[0] : null),
        likeCount: item.likeCount || 0,
        commentCount: item.commentCount || 0,
        shareCount: item.shareCount || 0,
        isLiked: item.isLiked || false,
        isShared: item.isShared || false,
        isSaved: true,
        time: item.createdAt,
      }));

      setPosts((prev) => (append ? [...prev, ...mappedPosts] : mappedPosts));
      setHasMore(newPosts.length === 10);
      setPage(pageNumber);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load saved posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved(1);
  }, []);

  // =========================
  // ✏️ EDIT HANDLER
  // =========================
  const handleEdit = (updatedPost: any) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? { ...p, ...updatedPost } : p))
    );
  };

  // =========================
  // 🗑️ DELETE HANDLER
  // =========================
  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  // =========================
  // 💾 UNSAVE HANDLER
  // =========================
  const handleUnsave = async (postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));

    try {
      await api.delete(`/posts/${postId}/save`);
      toast.success("Removed from saved");
    } catch (e: any) {
      toast.error("Unsave failed");
      fetchSaved(1); // rollback
    }
  };

  // =========================
  // 🧱 LOADING SKELETON
  // =========================
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  // =========================
  // 📭 EMPTY STATE
  // =========================
  if (!posts.length) {
    return (
      <div className="text-center text-muted-foreground py-20">
        No saved posts yet
      </div>
    );
  }

  // =========================
  // 🖼️ RENDER
  // =========================
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">Saved posts</h1>

      {posts.map((post) => (
        <Post
          key={post._id}
          post={post}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUnsave={handleUnsave}
          isSavedPage
        />
      ))}

      {/* 📄 LOAD MORE */}
      {hasMore && (
        <Button variant="outline" onClick={() => fetchSaved(page + 1, true)}>
          Load more
        </Button>
      )}
    </div>
  );
}