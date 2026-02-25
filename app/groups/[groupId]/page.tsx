"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Lock, Globe } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { SignedImage } from "@/components/common/SignedImage";
import Link from "next/link";
import Post, { PostData } from "@/components/post/Post";
import CreateGroupPost from "@/components/groups/posts/CreateGroupPost";
import PostEditDeleteDialogs from "@/components/post/modal/PostEditDeleteDialogs";

type GroupDetails = {
  _id: string;
  name: string;
  slug: string;
  privacy: "public" | "private";
  coverUrl?: {
    url?: string;
    key?: string;
    provider?: string;
  };
  about?: string;
  category?: string;
  location?: {
    country?: string;
    city?: string;
  };
  counts: {
    members: number;
    posts: number;
  };
  isCreatedByMe: boolean;
  myMembership: null | {
    _id: string;
    status: "active" | "requested";
    role: "member" | "admin" | "mod";
    joinedAt: string;
  };
};

/* 🧠 mapper: group post → PostData */
const mapGroupPostToPost = (gp: any): PostData => {
  return {
    _id: gp._id,
    authorId: gp.authorId,

    user: {
      userId: gp.author?.userId || gp.authorId,
      name: gp.author?.name || "User",
      avatar: gp.author?.avatar,
    },

    time: new Date(gp.createdAt).toLocaleString(),

    content: gp.text || gp.caption || "",

    media: gp.video
      ? { type: "video", ...gp.video }
      : gp.images?.length
      ? { type: "image", ...gp.images[0] }
      : undefined,

    likeCount: gp.likeCount || 0,
    commentCount: gp.commentCount || 0,
    shareCount: 0,
    isLiked: gp.isLiked || false,
    isShared: false,
  };
};

export default function GroupDetailsPage() {
  const { groupId } = useParams();

  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // ✏️ edit state
const [editingPost, setEditingPost] = useState<PostData | null>(null);
const [editText, setEditText] = useState("");

// 🗑️ delete state
const [deletingId, setDeletingId] = useState<string | null>(null);
// 🗑️ delete target (group)
const [deletingTarget, setDeletingTarget] = useState<{
  id: string;
  type: "group";
} | null>(null);

  /* 📥 group details */
  const fetchGroup = async () => {
    try {
      const res = await api.get(`/groups/${groupId}/group-details`);
      if (res.data.success) setGroup(res.data.group);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load group");
    } finally {
      setLoading(false);
    }
  };

  /* 📥 group posts */
  const fetchPosts = async () => {
    try {
      const res = await api.get(`/groups/${groupId}/posts`);
      setPosts(res.data.items || []);
      
    } catch (err) {
      console.error(err);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchGroup();
      fetchPosts();
    }
  }, [groupId]);

  /* 🤝 join */
  const handleJoin = async () => {
    if (!group) return;

    try {
      setJoining(true);
      const res = await api.post(`/groups/${group._id}/join`);

      if (res.data.success) {
        toast.success(res.data.message || "Join request sent");

        setGroup((prev) =>
          prev
            ? {
                ...prev,
                myMembership: {
                  _id: "temp",
                  status: res.data.status,
                  role: "member",
                  joinedAt: new Date().toISOString(),
                },
                counts: {
                  ...prev.counts,
                  members:
                    res.data.status === "active"
                      ? prev.counts.members + 1
                      : prev.counts.members,
                },
              }
            : prev,
        );
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Join failed");
    } finally {
      setJoining(false);
    }
  };


  //handle edit button
  const handleEdit = (post: PostData) => {
  setEditingPost(post);
  setEditText(post.content || "");
};

const handleEditSave = async () => {
  if (!editingPost) return;

  try {
    const res = await api.patch(
      `/groups/${groupId}/posts/${editingPost._id}`,
      { text: editText }
    );

    const updated = res.data.item;

    setPosts((prev) =>
      prev.map((p) =>
        p._id === updated._id
          ? { ...p, text: updated.text, caption: updated.text }
          : p
      )
    );

    toast.success("Post updated");
    setEditingPost(null);
  } catch (e: any) {
    toast.error(e?.response?.data?.message || "Update failed");
  }
};

//handle delete button

const handleDeleteConfirm = async () => {
  if (!deletingTarget) return;

  const { id } = deletingTarget;

  setPosts((prev) => prev.filter((p) => p._id !== id));
  setDeletingTarget(null);

  try {
    await api.delete(`/groups/${groupId}/posts/${id}`);
    toast.success("Post deleted");
  } catch (e: any) {
    toast.error(e?.response?.data?.message || "Delete failed");
  }
};

  /* 🔘 join button */
  const renderJoinButton = () => {
    if (!group) return null;

    if (group.isCreatedByMe) return <Button disabled>You are admin</Button>;

    if (!group.myMembership)
      return (
        <Button onClick={handleJoin} disabled={joining}>
          Join Group
        </Button>
      );

    if (group.myMembership.status === "requested")
      return <Button disabled>Requested</Button>;

    if (group.myMembership.status === "active")
      return <Button variant="secondary">Joined</Button>;
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!group) return <p className="text-center mt-10">Group not found</p>;

  const isActiveMember =
    group.myMembership?.status === "active" || group.isCreatedByMe;

  return (
    <div className="max-w-5xl mx-auto space-y-4 p-4 mt-4 bg-white rounded-xl">
      {/* 🖼 Cover */}
      <div className="w-full h-64 bg-muted rounded-xl overflow-hidden">
        {group.coverUrl?.url ? (
          <SignedImage
            url={group.coverUrl.url}
            keyPath={group.coverUrl.key}
            provider={group.coverUrl.provider}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No cover
          </div>
        )}
      </div>

      {/* 📌 Header */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{group.name}</h1>

              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                {group.privacy === "private" ? (
                  <>
                    <Lock size={16} /> Private group
                  </>
                ) : (
                  <>
                    <Globe size={16} /> Public group
                  </>
                )}

                <span className="flex items-center gap-1">
                  <Users size={16} />
                  {group.counts.members} members
                </span>
              </div>
            </div>

            <div className="flex gap-2">{renderJoinButton()}</div>
          </div>

          {group?.myMembership?.role === "admin" && (
            <Link href={`/groups/${group._id}/members`}>
              <Button variant="secondary">View Members</Button>
            </Link>
          )}
        </CardContent>
      </Card>

      {/* ℹ️ Info bar (Facebook style) */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <span>{group.about || "No description"}</span>

            {group.category && (
              <span className="font-medium text-foreground">
                Category: {group.category}
              </span>
            )}

            {(group.location?.city || group.location?.country) && (
              <span>
                Location: {group.location.city}, {group.location.country}
              </span>
            )}
          </div>

          <div className="text-muted-foreground">
            {group.counts.posts} posts
          </div>
        </CardContent>
      </Card>

      {/* 📰 Discussion full width */}
      <div className="space-y-4">
        {isActiveMember && (
          <CreateGroupPost
            groupId={group._id}
            onCreated={(newPost) => {
              setPosts((prev) => [newPost, ...prev]);
            }}
          />
        )}

        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold">Discussion</h2>

            {postsLoading ? (
              <p className="text-sm text-muted-foreground">Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No posts yet</p>
            ) : (
              posts.map((gp) => {
                const mappedPost = mapGroupPostToPost(gp);

                return (
                  <Post
                    key={mappedPost._id}
                    isGroupContext={true}
                    post={mappedPost}
                    onEdit={() => handleEdit(mappedPost)}
                    onDelete={(id) => setDeletingTarget({ id, type: "group" })}
                  />
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
      <PostEditDeleteDialogs
        editingPost={editingPost}
        editText={editText}
        setEditText={setEditText}
        onCloseEdit={() => setEditingPost(null)}
        onSaveEdit={handleEditSave}
        deletingId={deletingTarget?.id || null}
        onCloseDelete={() => setDeletingTarget(null)}
        onConfirmDelete={handleDeleteConfirm}
      />
    </div>
  );
}