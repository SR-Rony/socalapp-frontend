"use client";

import Image from "next/image";

export default function PostCard({ post }: { post: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={post.author.avatar?.url || "/avatar.png"}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">{post.author.name}</p>
          <p className="text-xs text-muted-foreground">
            @{post.author.username}
          </p>
        </div>
      </div>

      {/* Text */}
      {post.text && (
        <div className="px-4 pb-2 text-sm">{post.text}</div>
      )}

      {/* Media */}
      {post.medias?.length > 0 && (
        <div className="grid grid-cols-1">
          {post.medias.map((m: any, i: number) =>
            m.type === "image" ? (
              <Image
                key={i}
                src={m.url}
                alt="post"
                width={800}
                height={600}
                className="w-full object-cover"
              />
            ) : (
              <video
                key={i}
                src={m.url}
                controls
                className="w-full"
              />
            )
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex gap-6 px-4 py-3 text-sm text-muted-foreground">
        ❤️ {post.likeCount}
        💬 {post.commentCount}
        🔁 {post.shareCount}
      </div>
    </div>
  );
}
