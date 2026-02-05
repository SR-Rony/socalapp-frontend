"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfilePosts from "@/components/profile/ProfilePosts";
import ProfilePhotos from "@/components/profile/ProfilePhotos";
import ProfileReels from "@/components/profile/ProfileReels";
import ProfileInfo from "@/components/profile/ProfileInfo";

export default function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState("posts");

  useEffect(() => {
    if (!userId) return;
    api.get(`/users/${userId}`).then((res) => {
      if (res.data?.success) setUser(res.data.data);
    });
  }, [userId]);
  
   const handleUserUpdate = (updatedUser: any) => {
    setUser(updatedUser); // 🔥 THIS IS THE KEY
  };

  if (!user) return <p className="text-center mt-10">Loading…</p>;

  return (
    <div className="max-w-5xl mx-auto space-y-4 p-4">
       <ProfileHeader
        user={user}
        onUserUpdate={handleUserUpdate}
      />
      <ProfileInfo user={user} />
      <ProfileTabs value={tab} onChange={setTab} />

      {tab === "posts" && <ProfilePosts userId={userId as string} />}
      {tab === "photos" && <ProfilePhotos userId={userId as string} />}
      {tab === "reels" && <ProfileReels userId={userId as string} />}
    </div>
  );
}
