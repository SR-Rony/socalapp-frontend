"use client";

interface Props {
  user: any;
  isMe: boolean;
}

export default function ProfileHeader({ user, isMe }: Props) {
  return (
    <div className="relative">
      {/* Cover */}
      <div className="h-56 bg-gray-200">
        {user.cover?.url && (
          <img src={user.cover.url} className="w-full h-full object-cover" />
        )}
      </div>

      {/* Avatar */}
      <div className="absolute left-6 -bottom-12">
        <img
          src={user.avatar?.url || "/avatar.png"}
          className="w-28 h-28 rounded-full border-4 border-white"
        />
      </div>

      <div className="pt-16 px-6">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground">@{user.username}</p>
      </div>
    </div>
  );
}
