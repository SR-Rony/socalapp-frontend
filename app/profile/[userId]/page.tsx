"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileFeed from "@/components/profile/ProfileFeed";
import {
  getUserPosts,
  getUserPhotos,
  getUserReels,
} from "@/services/user.service";
import { useUser } from "@/hooks/useUser";

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useUser(userId);
  const [tab, setTab] = useState("posts");

  if (!user) return null;

  const loaderMap: any = {
    posts: (p: any) => getUserPosts(userId, p),
    photos: (p: any) => getUserPhotos(userId, p),
    reels: (p: any) => getUserReels(userId, p),
  };

  return (
    <>
      <ProfileHeader user={user} isMe={user.isMe} />
      <ProfileTabs active={tab} onChange={setTab} />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <ProfileFeed loader={loaderMap[tab]} />
      </div>
    </>
  );
}
