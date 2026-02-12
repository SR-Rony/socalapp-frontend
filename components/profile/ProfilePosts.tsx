"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Post, { PostData } from "@/components/post/Post";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProfilePosts({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  // edit state
  const [editingPost, setEditingPost] = useState<PostData | null>(null);
  const [editText, setEditText] = useState("");
  const [editPrivacy, setEditPrivacy] = useState("public");

  // fetch posts
  useEffect(() => {
    if (!userId) return;

    api
      .get(`/users/${userId}/posts`)
      .then((res) => {
        if (Array.isArray(res.data?.items)) {
          const mapped: PostData[] = res.data.items.map((post: any) => {
            const mediaItem = post.medias?.[0];

            return {
              _id: post._id,
              authorId: post.author._id,

              user: {
                userId: post.author._id,
                name: post.author.name,
                avatar: post.author.avatar,
              },

              time: formatTime(post.createdAt),
              content: post.text,

              media: mediaItem
                ? {
                    type: mediaItem.type,
                    key: mediaItem.key,
                    url: mediaItem.url,
                    provider: mediaItem.provider,
                  }
                : null,

              // ✅ ADD THESE
              likeCount: post.likeCount ?? 0,
              commentCount: post.commentCount ?? 0,
              shareCount: post.shareCount ?? 0,
              isLiked: post.isLiked ?? false,
              isShared: post.isShared ?? false,
            };
          });

          setPosts(mapped);
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // delete
  const handleDelete = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this post?");
    if (!ok) return;

    try {
      await api.delete(`users/me/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Post deleted");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  // open edit
  const handleEditOpen = (post: PostData) => {
    setEditingPost(post);
    setEditText(post.content);
    setEditPrivacy("public");
  };

  // save edit
  const handleSaveEdit = async () => {
    if (!editingPost) return;

    try {
      const res = await api.patch(`users/me/posts/${editingPost._id}`, {
        text: editText,
        privacy: editPrivacy,
      });

      setPosts((prev) =>
        prev.map((p) =>
          p._id === editingPost._id
            ? { ...p, content: res.data.item.text }
            : p
        )
      );

      toast.success("Post updated");
      setEditingPost(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p className="text-center">Loading posts...</p>;
  if (!posts.length)
    return <p className="text-center text-muted-foreground">No posts yet</p>;

  return (
    <>
      <div className="space-y-4">
        {posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            onEdit={handleEditOpen}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* 🔥 Edit Modal */}
      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>

          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[120px]"
          />

          <Select value={editPrivacy} onValueChange={setEditPrivacy}>
            <SelectTrigger>
              <SelectValue placeholder="Privacy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="friends">Friends</SelectItem>
              <SelectItem value="only_me">Only me</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" onClick={() => setEditingPost(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function formatTime(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
