"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  MessageCircle,
  Heart,
  Search,
  Trash2,
  Edit3,
  RotateCcw,
  Flame,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import Image from "next/image";

/* =======================
   Types
======================= */
type Post = {
  _id: string;
  text?: string;
  type: string;
  privacy: string;
  isDeleted?: boolean;
  createdAt: string;
  author: {
    name: string;
    username: string;
    avatar?: { url: string };
    isVerified?: boolean;
  };
  medias?: { type: string; url: string }[];
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
};

/* =======================
   Page
======================= */
export default function AdminPostsPage() {
  const ITEMS_PER_PAGE = 10;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [viewPost, setViewPost] = useState<Post | null>(null);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [editText, setEditText] = useState("");

  /* =======================
     Fetch Posts
  ======================= */
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/posts");
      if (res.data?.ok) {
        setPosts(res.data.data);
      }
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* =======================
     Actions
  ======================= */
  const updatePost = async () => {
    if (!editPost) return;
    try {
      await api.patch(`/admin/posts/${editPost._id}`, {
        text: editText,
      });
      toast.success("Post updated");
      setEditPost(null);
      fetchPosts();
    } catch {
      toast.error("Update failed");
    }
  };

  const softDelete = async (id: string) => {
    if (!confirm("Soft delete this post?")) return;
    try {
      await api.delete(`/admin/posts/${id}`);
      toast.success("Post deleted");
      fetchPosts();
    } catch {
      toast.error("Delete failed");
    }
  };

  const restorePost = async (id: string) => {
    try {
      await api.patch(`/admin/posts/${id}/restore`);
      toast.success("Post restored");
      fetchPosts();
    } catch {
      toast.error("Restore failed");
    }
  };

  const hardDelete = async (id: string) => {
    if (
      !confirm(
        "⚠️ Hard delete will permanently remove this post. Continue?"
      )
    )
      return;
    try {
      await api.delete(`/admin/posts/${id}/hard`);
      toast.success("Post permanently deleted");
      fetchPosts();
    } catch {
      toast.error("Hard delete failed");
    }
  };

  /* =======================
     Filter + Pagination
  ======================= */
  const filtered = posts.filter(
    (p) =>
      p.author.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

  /* =======================
     UI
  ======================= */
  return (
    <div className="space-y-6 bg-white p-4 rounded-xl">
      <h1 className="text-2xl font-semibold">Posts Management</h1>

      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
        <Input
          className="pl-9"
          placeholder="Search post..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-[1000px] w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-3">Author</th>
              <th className="border px-4 py-3">Type</th>
              <th className="border px-4 py-3">Status</th>
              <th className="border px-4 py-3">Created</th>
              <th className="border px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((post) => (
              <tr
                key={post._id}
                className={`hover:bg-gray-50 ${
                  post.isDeleted ? "opacity-60" : ""
                }`}
              >
                <td className="border px-4 py-2">
                  {post.author.name}
                  <div className="text-xs text-muted-foreground">
                    @{post.author.username}
                  </div>
                </td>

                <td className="border px-4 py-2">
                  {post.type}
                </td>

                <td className="border px-4 py-2">
                  {post.isDeleted ? (
                    <span className="text-red-600">
                      Deleted
                    </span>
                  ) : (
                    <span className="text-green-600">
                      Active
                    </span>
                  )}
                </td>

                <td className="border px-4 py-2">
                  {new Date(
                    post.createdAt
                  ).toLocaleString()}
                </td>

                <td className="border px-4 py-2 flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setViewPost(post)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>

                  {!post.isDeleted && (
                    <>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setEditPost(post);
                          setEditText(post.text || "");
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() =>
                          softDelete(post._id)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {post.isDeleted && (
                    <>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          restorePost(post._id)
                        }
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() =>
                          hardDelete(post._id)
                        }
                      >
                        <Flame className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      <Dialog open={!!viewPost} onOpenChange={() => setViewPost(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Post Details</DialogTitle>
          </DialogHeader>

          {viewPost && (
            <div className="space-y-4">
              <p className="font-medium">
                {viewPost.author.name}
              </p>
              <p className="whitespace-pre-line">
                {viewPost.text}
              </p>

              {viewPost.medias?.map((media, i) => (
                  <div key={i} className="overflow-hidden rounded-lg">
                    {/* Image */}
                    {media.type === "image" && (
                      <div className="relative w-full h-[420px]">
                        <Image
                          src={media.url}
                          alt="Post media"
                          fill
                          className="object-cover rounded-lg"
                          sizes="(max-width: 768px) 100vw, 800px"
                          priority={false}
                        />
                      </div>
                    )}

                    {/* Video */}
                    {media.type === "video" && (
                      <video
                        src={media.url}
                        controls
                        className="w-full max-h-[420px] rounded-lg"
                      />
                    )}
                  </div>
                ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editPost} onOpenChange={() => setEditPost(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>

          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setEditPost(null)}
            >
              Cancel
            </Button>
            <Button onClick={updatePost}>
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
