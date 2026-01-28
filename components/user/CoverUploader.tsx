"use client";

import { useRef, useState } from "react";
import api from "@/lib/api";

export default function CoverUploader({ cover }: { cover?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const uploadCover = async (file: File) => {
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("file", file);

      await api.post("/users/me/cover", fd);
      window.location.reload();
    } catch {
      alert("Cover upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-[220px] bg-gray-200 rounded-xl overflow-hidden">
      {cover && (
        <img
          src={cover}
          className="w-full h-full object-cover"
        />
      )}

      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            uploadCover(e.target.files[0]);
          }
        }}
      />

      <button
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-4 py-1.5 rounded-lg"
      >
        Change cover
      </button>
    </div>
  );
}
