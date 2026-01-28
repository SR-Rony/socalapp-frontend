"use client";

import { useMe } from "@/hooks/useMe";
import EditProfileModal from "@/components/user/EditProfileModal";

export default function ProfileSettingsPage() {
  const { me, loading } = useMe();

  if (loading) {
    return <p className="p-6 text-center">Loading...</p>;
  }

  if (!me) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Profile Settings
      </h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="font-medium">{me.name}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Username</p>
          <p>@{me.username}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Country</p>
          <p>{me.country || "Not set"}</p>
        </div>

        <EditProfileModal user={me} />
      </div>
    </div>
  );
}
