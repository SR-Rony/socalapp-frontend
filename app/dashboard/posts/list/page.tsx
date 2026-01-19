"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  MessageCircle,
  Heart,
  Search,
  Trash2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/lib/api";
import { toast } from "sonner";
import Image from "next/image";

/* =======================
   Types
======================= */
type FeedPost = {
  _id: string;
  author: {
    name: string;
  };
  type: string;
  approved: boolean;
  createdAt: string;
};

type FeedStats = {
  totalPosts: number;
  pendingPosts: number;
  comments: number;
  reactions: number;
};

/* =======================
   Page
======================= */
export default function PostsPage() {
  const ITEMS_PER_PAGE = 10;

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [stats, setStats] = useState<FeedStats>({
    totalPosts: 0,
    pendingPosts: 0,
    comments: 0,
    reactions: 0,
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
const [open, setOpen] = useState(false);

  /* =======================
     Fetch Feed
  ======================= */
  const fetchFeed = async () => {
    setLoading(true);
    try {
      const res = await api.get("posts/feed", {
        params: {
          limit: 100,
        },
      });

      console.log("all post data",res.data);
      

      if (res.data?.success) {
        const items = res.data.items || [];
        console.log("posts item",items);
        

        setPosts(items);
        setStats({
          totalPosts: items.length,   // ✅ এখানে
          pendingPosts: res.data.stats?.pendingPosts || 0,
          comments: res.data.stats?.comments || 0,
          reactions: res.data.stats?.reactions || 0,
        });
      }
    } catch (error) {
      console.error("Feed load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  /* =======================
     Stats UI (DESIGN SAME)
  ======================= */
  const statsUI = [
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: FileText,
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Pending Posts",
      value: stats.pendingPosts,
      icon: Clock,
      gradient: "from-amber-500 to-amber-600",
    },
    {
      title: "Comments",
      value: stats.comments,
      icon: MessageCircle,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Reactions",
      value: stats.reactions,
      icon: Heart,
      gradient: "from-pink-500 to-rose-600",
    },
  ];


  // handler delete post
const handlePostDelete = async (postId: string) => {
  if (!postId) return;

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this post?"
  );
  if (!confirmDelete) return;

  try {
    // ✅ route match করানো হলো
    const res = await api.delete(`/posts/${postId}/delete`);
    

    if (res.data?.success) {
      toast.success("Post deleted");

      // ✅ UI থেকে post remove
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    }
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Failed to delete post"
    );
  }
};



  /* =======================
     Filter + Pagination
  ======================= */
  const filteredPosts = posts.filter(
    (post) =>
      post.author.name.toLowerCase().includes(search.toLowerCase()) ||
      post.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* =======================
     UI
  ======================= */
  return (
    <div className="space-y-8">
      {/* 🔹 Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsUI.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`
                bg-gradient-to-r ${item.gradient}
                rounded-xl p-5 text-white shadow
                hover:shadow-lg transition
              `}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm text-white/80">{item.title}</p>
                  <h3 className="text-3xl font-bold">
                    {loading ? "—" : item.value}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔹 Table Section */}
      <div className="bg-white rounded-xl shadow border">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b">
          <h2 className="text-lg font-semibold">Posts List</h2>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by author or type..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 border-collapse">
            <thead className="bg-gray-100 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left border font-semibold">ID</th>
                <th className="px-4 py-3 text-left border font-semibold">
                  Author
                </th>
                <th className="px-4 py-3 text-left border font-semibold">
                  Type
                </th>
                <th className="px-4 py-3 text-left border font-semibold">
                  Approved
                </th>
                <th className="px-4 py-3 text-left border font-semibold">
                  Time
                </th>
                <th className="px-4 py-3 text-left border font-semibold">
                  Link
                </th>
                <th className="px-4 py-3 text-right border font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedPosts.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-muted-foreground border"
                  >
                    No posts found
                  </td>
                </tr>
              )}

              {paginatedPosts.map((post, index) => (
                <tr key={post._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 border">
                    {startIndex + index + 1}
                  </td>

                  <td className="px-4 py-3 border font-medium">
                    {post.author.name}
                  </td>

                  <td className="px-4 py-3 border">
                    <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-1 text-xs">
                      {post.type}
                    </span>
                  </td>

                  <td className="px-4 py-3 border">
                    {post.approved ? (
                      <span className="rounded-full bg-green-100 text-green-700 px-2 py-1 text-xs">
                        Approved
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 text-yellow-700 px-2 py-1 text-xs">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 border text-muted-foreground">
                    {new Date(post.createdAt).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 border">
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setOpen(true);
                      }}
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </button>
                  </td>

                  <td className="px-4 py-3 border text-right">
                    <Button
                      onClick={() => handlePostDelete(post._id)}
                      size="icon"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔹 Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredPosts.length)}
              </span>{" "}
              of <span className="font-medium">{filteredPosts.length}</span>{" "}
              entries
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Post Details</DialogTitle>
          </DialogHeader>

          {selectedPost && (
            <div className="space-y-5 text-sm">
              {/* ===== Author ===== */}
              <div className="flex items-center gap-3">
                {selectedPost.author?.avatar?.url && (
                  <img
                    src={selectedPost.author.avatar.url}
                    alt="avatar"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{selectedPost.author?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    @{selectedPost.author?.username}
                  </p>
                </div>
              </div>

              {/* ===== Meta ===== */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Type:</span>{" "}
                  {selectedPost.type}
                </div>

                <div>
                  <span className="font-medium">Privacy:</span>{" "}
                  {selectedPost.privacy}
                </div>

                <div>
                  <span className="font-medium">Likes:</span>{" "}
                  {selectedPost.likeCount}
                </div>

                <div>
                  <span className="font-medium">Comments:</span>{" "}
                  {selectedPost.commentCount}
                </div>

                <div>
                  <span className="font-medium">Shares:</span>{" "}
                  {selectedPost.shareCount}
                </div>

                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(selectedPost.createdAt).toLocaleString()}
                </div>
              </div>

              {/* ===== Text ===== */}
              {selectedPost.text && (
                <div>
                  <span className="font-medium">Post Text:</span>
                  <p className="mt-2 whitespace-pre-line text-muted-foreground">
                    {selectedPost.text}
                  </p>
                </div>
              )}

              {/* ===== Media ===== */}
              {Array.isArray(selectedPost.medias) &&
                selectedPost.medias.length > 0 && (
                  <div className="space-y-3">
                    <span className="font-medium">Media:</span>

                    {selectedPost.medias.map((media: any, idx: number) => (
                      <div key={idx}>
                        {/* Image */}
                        {media.type === "image" && (
                          <img
                            src={media.url}
                            alt="post media"
                            className="rounded-lg max-h-80 w-full object-cover"
                          />
                        )}

                        {/* Video */}
                        {media.type === "video" && (
                          <video
                            src={media.url}
                            controls
                            className="rounded-lg max-h-80 w-full"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>


    </div>
  );
}
