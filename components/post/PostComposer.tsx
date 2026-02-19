"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImageIcon, VideoIcon, Smile, X } from "lucide-react";
import { useAppSelector } from "@/redux/hook/hook";
import api from "@/lib/api";
import Link from "next/link";
import { SignedImage } from "../common/SignedImage";
import { SignedVideo } from "../common/SignedVideo";

/* ========================
   Types
======================== */
type PostMode = "create" | "edit";
type PostType = "text" | "image" | "video";

interface Media {
  url: string;
  type: "image" | "video";
  provider?: string;

  key?: string;          // ✅ Wasabi object key

  publicId?: string;     // (legacy cloudinary থাকলে রাখতে পারো)
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  durationSec?: number;
}

export default function PostComposer({
  editingPost = null,
  onSuccess,
}: {
  editingPost?: any;
  onSuccess?: (post: any) => void;
}) {
  const { user } = useAppSelector((state: any) => state.auth);
  

  /* ========================
     Refs
  ======================== */
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  /* ========================
     State
  ======================== */
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<PostMode>(
    editingPost ? "edit" : "create"
  );

  const [type, setType] = useState<PostType>("text");
  const [text, setText] = useState("");
  const [images, setImages] = useState<Media[]>([]);
  const [video, setVideo] = useState<Media | null>(null);
  const [loading, setLoading] = useState(false);

  /* ========================
     Load edit / draft
  ======================== */
  useEffect(() => {
    if (editingPost) {
      setMode("edit");
      setOpen(true);
      setType(editingPost.type || "text");
      setText(editingPost.text || "");
      setImages(
        editingPost.medias?.filter((m: Media) => m.type === "image") || []
      );
      setVideo(
        editingPost.medias?.find((m: Media) => m.type === "video") || null
      );
    } else {
      const draft = localStorage.getItem("post-draft");
      if (draft) {
        const d = JSON.parse(draft);
        setType(d.type || "text");
        setText(d.text || "");
        setImages(d.images || []);
        setVideo(d.video || null);
      }
    }
  }, [editingPost]);

  /* ========================
     Draft Save
  ======================== */
  useEffect(() => {
    if (!open || mode === "edit") return;

    localStorage.setItem(
      "post-draft",
      JSON.stringify({ type, text, images, video })
    );
  }, [type, text, images, video, open, mode]);

  /* ========================
     Image Upload (Cloudinary example)
  ======================== */
 const handleImageUpload = async (files: FileList | null) => {
  if (!files) return;

  setType("image");

  const uploaded: Media[] = [];

  for (const file of Array.from(files)) {
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await api.post("/upload/image", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;

      if (!data.ok) {
        console.error("Upload failed:", data.message);
        continue;
      }

      uploaded.push({
        url: data.url,
        type: "image",
        provider: data.provider,
        key: data.key,
        width: data.width,
        height: data.height,
      });
    } catch (err: any) {
      console.error("Upload error:", err?.response?.data || err.message);
    }
  }

  setImages((prev) => [...prev, ...uploaded]);
};


  /* ========================
     Video Upload
  ======================== */
 const handleVideoUpload = async (file: File | null) => {
  if (!file) return;

  setType("video");

  const form = new FormData();
  form.append("file", file);

  try {
    const res = await api.post("/upload/video", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = res.data;

    if (!data.ok) {
      console.error("Upload failed:", data.message);
      return;
    }

    setVideo({
      url: data.url,              // ✅ Wasabi video URL
      type: "video",
      provider: data.provider,   // "wasabi"
      key: data.key,
      thumbnailUrl: data.thumbnailUrl || "", // যদি backend দেয়
      durationSec: data.durationSec || 0,
    });
  } catch (err: any) {
    console.error("Video upload error:", err?.response?.data || err.message);
  }
};


  /* ========================
     Submit
  ======================== */
  const handleSubmit = async () => {
    if (!text.trim() && !images.length && !video) {
      toast.error("Post content is required");
      return;
    }

    setLoading(true);
    try {
      let payload: any = {
        type,
        privacy: "public",
      };

      if (type === "text") payload.text = text;
      if (type === "image") payload = { ...payload, caption: text, images };
      if (type === "video") payload = { ...payload, caption: text, video };

      const res =
        mode === "edit" && editingPost?._id
          ? await api.patch(`/posts/${editingPost._id}`, { text })
          : await api.post("/posts/create", payload);

      toast.success(mode === "edit" ? "Post updated" : "Post created");

      localStorage.removeItem("post-draft");
      setOpen(false);
      setText("");
      setImages([]);
      setVideo(null);
      setType("text");

      onSuccess?.(res.data.post);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Post failed");
    } finally {
      setLoading(false);
    }
  };
  

  /* ========================
     UI
  ======================== */
  return (
    <>
      {/* ===== Composer Card ===== */}
      <Card className="w-full rounded-xl shadow-sm mb-3">
        <CardContent className="p-2 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 shrink-0">
              <Link href={`/profile/${user._id}`}>
              <SignedImage
                  keyPath={user?.avatar?.key}
                  url={user?.avatar?.url} 
                  provider={user?.avatar?.provider}
                  alt="profile"
                  className="rounded-full w-10 h-10 object-cover"
                />
              </Link>
            </div>

            <Input
              readOnly
              onClick={() => {
                setMode("create");
                setOpen(true);
              }}
              placeholder={`What's on your mind, ${user?.name || "Rony"}?`}
              className="rounded-full bg-muted cursor-pointer"
            />

            <div className="flex gap-3">
              <VideoIcon className="text-red-500" />
              <ImageIcon className="text-green-500" />
              <Smile className="text-yellow-500" />
            </div>
          </div>

          <Separator className="my-3" />
        </CardContent>
      </Card>

      {/* ===== Modal ===== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-full h-[100dvh] sm:h-auto sm:max-w-xl p-0 rounded-none sm:rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-base font-semibold">
              {mode === "edit" ? "Edit post" : "Create post"}
            </h2>
            <X className="cursor-pointer" onClick={() => setOpen(false)} />
          </div>

          {/* User */}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="relative w-10 h-10">
              <SignedImage
                keyPath={user?.avatar?.key}
                url={user?.avatar?.url} 
                provider={user?.avatar?.provider}
                alt="profile"
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Public</p>
            </div>
          </div>

          {/* Text */}
          <div className="px-4">
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`What's on your mind, ${user?.name || "Rony"}?`}
              className="w-full min-h-[150px] resize-none outline-none text-base"
            />
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="px-4 mt-3 grid grid-cols-2 gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <SignedImage
                    keyPath={img?.key}
                    url={img?.url} 
                    provider={img?.provider}
                    alt="ipreview"
                    className="rounded-lg object-cover"
                  />
                  <X
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 cursor-pointer"
                    onClick={() =>
                      setImages((prev) =>
                        prev.filter((_, idx) => idx !== i)
                      )
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {/* Video Preview */}
          {video && (
            <div className="px-4 mt-3 relative">
              <SignedVideo
                url={video.url}
                keyPath={video.key}
                provider={video.provider}
              />;
              <X
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 cursor-pointer"
                onClick={() => setVideo(null)}
              />
            </div>
          )}

          {/* Add to post */}
          <div className="px-4 py-3 border-t flex items-center justify-between">
            <span className="text-sm">Add to your post</span>
            <div className="flex gap-3">
              <ImageIcon
                className="cursor-pointer text-green-500"
                onClick={() => imageRef.current?.click()}
              />
              <VideoIcon
                className="cursor-pointer text-red-500"
                onClick={() => videoRef.current?.click()}
              />
              <Smile className="cursor-pointer text-yellow-500" />
            </div>

            <input
              ref={imageRef}
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
            />
            <input
              ref={videoRef}
              type="file"
              hidden
              accept="video/*"
              onChange={(e) =>
                handleVideoUpload(e.target.files?.[0] || null)
              }
            />
          </div>

          {/* Submit */}
          <div className="px-4 py-3 border-t">
            <Button
              className="w-full"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading
                ? "Please wait..."
                : mode === "edit"
                ? "Update"
                : "Post"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
