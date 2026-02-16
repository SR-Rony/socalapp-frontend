"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Trash2,
  RotateCcw,
  Trash,
  User,
  Video,
  ImageIcon,
  Type,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SignedImage } from "@/components/common/SignedImage";

/* =======================
   Types
======================= */
type Story = {
  _id: string;
  type: "image" | "video" | "text";
  text?: string;
  backgroundUrl?: string;
  isDeleted: boolean;
  createdAt: string;
  userId?: {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  media?: {
    url: string;
    key: string;
    provider: string;
    thumbnailUrl?: string;
  };
};

/* =======================
   Component
======================= */
export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(50);
  const [userId, setUserId] = useState("");

  /* =======================
     Fetch stories
  ======================= */
  const fetchStories = async () => {
    try {
      setLoading(true);

      const url = userId
        ? `/admin/stories/user/${userId}?limit=${limit}`
        : `/admin/stories?limit=${limit}`;

      const res = await api.get(url);

      if (res.data?.ok) {
        setStories(res.data.items || []);
      }
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || "Failed to load stories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [limit]);

  /* =======================
     Actions
  ======================= */
  const softDelete = async (id: string) => {
    try {
      await api.delete(`/admin/stories/${id}`);
      toast.success("Story deleted");
      fetchStories();
    } catch {
      toast.error("Delete failed");
    }
  };

  const restore = async (id: string) => {
    try {
      await api.patch(`/admin/stories/${id}/restore`);
      toast.success("Story restored");
      fetchStories();
    } catch {
      toast.error("Restore failed");
    }
  };

  const hardDelete = async (id: string) => {
    if (!confirm("Permanently delete this story?")) return;

    try {
      await api.delete(`/admin/stories/${id}/hard`);
      toast.success("Story permanently deleted");
      fetchStories();
    } catch {
      toast.error("Hard delete failed");
    }
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="space-y-6 bg-white p-4 rounded-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Story Management</h1>

        <div className="flex gap-2">
          <Input
            placeholder="Filter by userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Button onClick={fetchStories}>Search</Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {[20, 50, 100, 200].map((n) => (
          <Button
            key={n}
            size="sm"
            variant={limit === n ? "default" : "outline"}
            onClick={() => setLimit(n)}
          >
            {n}
          </Button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-[1000px] w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">User</th>
              <th className="border px-3 py-2">Story</th>
              <th className="border px-3 py-2">Type</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Created</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            )}

            {!loading &&
              stories.map((story) => (
                <tr key={story._id} className="hover:bg-gray-50">
                  {/* User */}
                  <td className="border px-3 py-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <p>{story.userId?.name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">
                          @{story.userId?.username}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Preview */}
                  <td className="border px-3 py-2">
                    {story.type === "image" && story.media && (
                      <SignedImage
                      url={story.media.url} // cache-busting
                      keyPath={story.media.key}
                      provider={story.media.provider}
                      alt="story"
                      className="w-10 h-9 object-cover"
                    />
                    )}

                    {story.type === "video" && (
                      <video
                        src={story.media?.url}
                        className="w-24 rounded"
                        controls
                      />
                    )}

                    {story.type === "text" && (
                      <div
                        className="p-3 rounded text-white"
                        style={{
                          backgroundImage: `url(${story.backgroundUrl})`,
                          backgroundSize: "cover",
                        }}
                      >
                        {story.text}
                      </div>
                    )}
                  </td>

                  {/* Type */}
                  <td className="border px-3 py-2">
                    <Badge variant="outline" className="gap-1">
                      {story.type === "image" && <ImageIcon className="h-3 w-3" />}
                      {story.type === "video" && <Video className="h-3 w-3" />}
                      {story.type === "text" && <Type className="h-3 w-3" />}
                      {story.type}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="border px-3 py-2">
                    {story.isDeleted ? (
                      <Badge variant="destructive">Deleted</Badge>
                    ) : (
                      <Badge className="bg-green-600">Active</Badge>
                    )}
                  </td>

                  {/* Time */}
                  <td className="border px-3 py-2">
                    {new Date(story.createdAt).toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td className="border px-3 py-2">
                    <div className="flex gap-2">
                      {!story.isDeleted ? (
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => softDelete(story._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => restore(story._id)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => hardDelete(story._id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && stories.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  No stories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
