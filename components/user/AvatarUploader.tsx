"use client";

import { useRef, useState } from "react";
import api from "@/lib/api";

export default function AvatarUploader({ avatar }: { avatar?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const upload = async (file: File) => {
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("file", file);

      await api.post("/users/me/avatar", fd);
      window.location.reload();
    } catch (e) {
      alert("Avatar upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <img
        src={avatar || "/avatar.png"}
        className="w-20 h-20 rounded-full object-cover"
      />

      <input
        ref={fileRef}
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            upload(e.target.files[0]);
          }
        }}
      />

      <button
        onClick={() => fileRef.current?.click()}
        className="text-sm text-blue-600"
        disabled={loading}
      >
        Change Avatar
      </button>
    </div>
  );
}
