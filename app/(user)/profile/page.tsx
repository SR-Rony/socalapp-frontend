"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";// তোমার redux hook
import Image from "next/image";
import { useAppSelector } from "@/redux/hook/hook";

/* =======================
   Types
======================= */
type Profile = {
  _id: string;
  name: string;
  username: string;
  country?: string;
  avatar?: { url: string };
  cover?: { url: string };
  address?: {
    fullAddress?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  education?: { school?: string; degree?: string; year?: string }[];
};

type Post = {
  _id: string;
  text?: string;
  medias?: any[];
  author: {
    _id: string;
    name: string;
    username: string;
    avatar?: any;
    isMe: boolean;
  };
  createdAt: string;
  canEdit: boolean;
  canDelete: boolean;
};


/* =======================
   Page
======================= */
export default function ProfilePage() {
  const { user: reduxUser } = useAppSelector((state: any) => state.auth);
  const [profile, setProfile] = useState<Profile | null>(reduxUser || null);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  //========================
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<any>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);

  /* =======================
     Fetch full profile from API
  ======================== */
  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/me");
      
      if (res.data?.success) {
        setProfile(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  //post fetching
  const loadMyPosts = async () => {
  if (loadingPosts) return;
  setLoadingPosts(true);

  try {
    const res = await api.get("/users/me/posts", {
      params: {
        limit: 10,
        cursor,
      },
    });

    console.log('profile data',res.data);
    
    if (res.data?.success) {
      setPosts((prev) => [...prev, ...res.data.items]);
      setCursor(res.data.nextCursor);
    }
  } catch (err) {
    console.error("Load posts failed");
  } finally {
    setLoadingPosts(false);
  }
};

  useEffect(() => {
    fetchProfile();
    loadMyPosts();
  }, []);

  /* =======================
     Update profile
  ======================== */
  const updateProfile = async () => {
    if (!profile) return;
    setLoading(true);

    try {
      // 1️⃣ Update avatar if selected
      if (avatarFile) {
        const avatarData = new FormData();
        avatarData.append("file", avatarFile);
        await api.post("/users/me/avatar", avatarData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // 2️⃣ Update cover if selected
      if (coverFile) {
        const coverData = new FormData();
        coverData.append("file", coverFile);
        await api.post("/users/me/cover", coverData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // 3️⃣ Update rest of profile
      const res = await api.patch("/users/me", {
        name: profile.name,
        country: profile.country,
        address: profile.address,
        contact: profile.contact,
        education: profile.education,
      });

      if (res.data?.ok) {
        toast.success("Profile updated successfully");
        fetchProfile();
        setAvatarFile(null);
        setCoverFile(null);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <p className="text-muted-foreground">Loading profile...</p>;

  /* =======================
     UI
  ======================== */
  return (
  <div className="w-full bg-gray-100 min-h-screen">
    {/* ===== Cover ===== */}
    <div className="relative w-full h-64 bg-gray-300">
      {profile.cover?.url && (
        <Image
          src={profile.cover.url}
          alt="Cover"
          fill
          className="object-cover"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && setCoverFile(e.target.files[0])}
        className="absolute bottom-4 right-4 bg-white p-2 rounded shadow cursor-pointer"
      />
    </div>

    {/* ===== Avatar + Name ===== */}
    <div className="max-w-6xl mx-auto px-4">
      <div className="relative flex items-end gap-6 -mt-16">
        <div className="relative w-36 h-36 rounded-full border-4 border-white overflow-hidden bg-gray-200">
          {profile.avatar?.url && (
            <Image
              src={profile.avatar.url}
              alt="Avatar"
              fill
              className="object-cover"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setAvatarFile(e.target.files[0])}
            className="absolute bottom-1 right-1 bg-white p-1 rounded-full cursor-pointer"
          />
        </div>

        <div className="mb-4">
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-gray-500">@{profile.username}</p>
        </div>
      </div>
    </div>

    {/* ===== Main Content ===== */}
    <div className="max-w-6xl mx-auto px-4 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT : USER INFO ================= */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow p-4 space-y-4">
            <h2 className="font-semibold text-lg">Basic Information</h2>

            <div>
              <Label>Name</Label>
              <Input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Country</Label>
              <Input
                value={profile.country || ""}
                onChange={(e) =>
                  setProfile({ ...profile, country: e.target.value })
                }
              />
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-xl shadow p-4 space-y-4">
            <h2 className="font-semibold text-lg">Address</h2>

            <Input
              placeholder="Full address"
              value={profile.address?.fullAddress || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  address: {
                    ...profile.address,
                    fullAddress: e.target.value,
                  },
                })
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="City"
                value={profile.address?.city || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    address: { ...profile.address, city: e.target.value },
                  })
                }
              />
              <Input
                placeholder="State"
                value={profile.address?.state || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    address: { ...profile.address, state: e.target.value },
                  })
                }
              />
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-xl shadow p-4 space-y-4">
            <h2 className="font-semibold text-lg">Contact</h2>

            <Input
              placeholder="Phone"
              value={profile.contact?.phone || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  contact: { ...profile.contact, phone: e.target.value },
                })
              }
            />
            <Input
              placeholder="Email"
              value={profile.contact?.email || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  contact: { ...profile.contact, email: e.target.value },
                })
              }
            />
            <Input
              placeholder="Website"
              value={profile.contact?.website || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  contact: { ...profile.contact, website: e.target.value },
                })
              }
            />
          </div>

          <Button
            className="w-full"
            onClick={updateProfile}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </aside>

        {/* ================= RIGHT : POSTS ================= */}
        <main className="lg:col-span-8 space-y-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow p-4 space-y-3"
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  {post.author.avatar?.url && (
                    <img
                      src={post.author.avatar.url}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    @{post.author.username}
                  </p>
                </div>

                {post.canEdit && (
                  <div className="ml-auto flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              {/* Content */}
              {post.text && <p>{post.text}</p>}

              {/* Media */}
              {post.medias?.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {post.medias.map((m, i) => (
                    <img
                      key={i}
                      src={m.url}
                      className="rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))}

          {cursor && (
            <Button
              variant="outline"
              className="w-full"
              onClick={loadMyPosts}
              disabled={loadingPosts}
            >
              {loadingPosts ? "Loading..." : "Load more"}
            </Button>
          )}
        </main>
      </div>
    </div>
  </div>
);

}
