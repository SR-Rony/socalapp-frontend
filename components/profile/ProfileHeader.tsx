"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SignedImage } from "../common/SignedImage";
import { Camera } from "lucide-react";

export default function ProfileHeader({
  user,
  onUserUpdate,
}: {
  user: any;
  onUserUpdate?: (u: any) => void;
}) {
  const [profile, setProfile] = useState(user);
  const [uploading, setUploading] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  /* 🔁 sync when parent user changes */
  useEffect(() => {
    setProfile(user);
  }, [user]);
  
  

  /* ======================
     Upload Avatar
  ====================== */
  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const res = await api.post("/users/me/avatar", formData);

      if (res.data?.ok) {
        const updated = {
          ...profile,
          avatar: res.data.avatar,
        };

        setProfile(updated);
        onUserUpdate?.(updated);

        toast.success("Profile picture updated");
      }
    } catch {
      toast.error("Avatar upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ======================
     Upload Cover
  ====================== */
  const handleCoverChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const res = await api.post("/users/me/cover", formData);

      if (res.data?.ok) {
        const updated = {
          ...profile,
          cover: res.data.user.cover,
        };

        setProfile(updated);
        onUserUpdate?.(updated);

        toast.success("Cover photo updated");
      }
    } catch {
      toast.error("Cover upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ======================
     handleFollowToggle
  ====================== */

const handleFollowToggle = async () => {
  if (profile.isMe) return;

  const prev = profile;

  // 🔥 optimistic UI
  const updated = {
    ...profile,
    isFollowing: !profile.isFollowing,
    followerCount: profile.isFollowing
      ? profile.followerCount - 1
      : profile.followerCount + 1,
  };

  setProfile(updated);
  onUserUpdate?.(updated);

  try {
    if (prev.isFollowing) {
      // ✅ UNFOLLOW
      await api.delete(`/follow/${profile._id}`);
    } else {
      // ✅ FOLLOW
      await api.post(`/follow/${profile._id}`);
    }
  } catch (err) {
    // ❌ rollback
    setProfile(prev);
    onUserUpdate?.(prev);
    toast.error("Follow action failed");
  }
};


  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {/* ================= COVER ================= */}
      <div className="relative h-56 bg-gray-300 group">
        {profile.cover?.url && (
          <SignedImage
            keyPath={profile.cover.key}
            url={profile.cover.url}
            provider={profile.cover.provider}
            alt="cover"
            className="w-full h-full object-cover pointer-events-none"
          />
        )}

        {profile.isMe && (
          <>
            <button
              onClick={() => coverInputRef.current?.click()}
              className="absolute bottom-3 right-3 flex items-center gap-2
              bg-black/60 text-white px-3 py-1.5 rounded-md text-sm
              opacity-0 group-hover:opacity-100 transition"
              disabled={uploading}
            >
              <Camera size={16} />
              Edit cover
            </button>

            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleCoverChange}
            />
          </>
        )}
      </div>

      {/* ================= AVATAR ================= */}
      <div className="px-6 py-4">
        <div className="flex items-end gap-4 -mt-14">
          <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200 group">
            {profile.avatar?.url && (
              <SignedImage
                keyPath={profile.avatar.key}
                url={profile.avatar.url}
                provider={profile.avatar.provider}
                alt="avatar"
                className="w-full h-full object-cover pointer-events-none"
              />
            )}

            {profile.isMe && (
              <>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center
                  bg-black/50 text-white opacity-0 group-hover:opacity-100 transition"
                  disabled={uploading}
                >
                  <Camera />
                </button>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                />
              </>
            )}
          </div>

          <div className="flex-1">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>

              <div className="flex items-center gap-3 mt-2">
                <p className="text-sm">
                  {profile.followerCount} followers
                </p>
              </div>
            </div>
            {!profile.isMe && (
                <Button
                  size="sm"
                  variant={profile.isFollowing ? "outline" : "default"}
                  onClick={handleFollowToggle}
                >
                  {profile.isFollowing ? "Following" : "Follow"}
                </Button>
              )}
        </div>
      </div>
    </div>
  );
}
