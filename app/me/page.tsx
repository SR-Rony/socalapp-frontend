"use client";

import { useMe } from "@/hooks/useMe";
import ProfileHeader from "@/components/profile/ProfileHeader";

export default function MyProfilePage() {
  const { me, loading } = useMe();
  if (loading) return <p>Loading...</p>;
  if (!me) return null;

  return <ProfileHeader user={me} isMe />;
}
