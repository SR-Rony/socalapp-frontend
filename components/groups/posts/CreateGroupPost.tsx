"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, VideoIcon, Type } from "lucide-react";
import { toast } from "sonner";

type Props = {
  groupId: string;
  onCreated?: (post: any) => void;
};

type PostType = "text" | "image" | "video";

export default function CreateGroupPost({ groupId, onCreated }: Props) {
  const [type, setType] = useState<PostType>("text");

  const [text, setText] = useState("");
  const [caption, setCaption] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 📤 upload image
  const uploadImages = async () => {
    const uploaded: any[] = [];

    for (const img of images) {
      const formData = new FormData();
      formData.append("file", img);

      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      uploaded.push({
        url: res.data.url,
        key: res.data.key,
        provider: res.data.provider,
      });
    }

    return uploaded;
  };

  // 📤 upload video
  const uploadVideoFile = async () => {
    if (!video) return null;

    const formData = new FormData();
    formData.append("file", video);

    const res = await api.post("/upload/video", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return {
      url: res.data.url,
      key: res.data.key,
      provider: res.data.provider,
    };
  };

  const resetForm = () => {
    setText("");
    setCaption("");
    setImages([]);
    setVideo(null);
    setType("text");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload: any = { type };

      if (type === "text") {
        payload.text = text.trim();
      }

      if (type === "image") {
        setUploading(true);
        const uploadedImages = await uploadImages();
        setUploading(false);

        payload.caption = caption.trim();
        payload.images = uploadedImages;
      }

      if (type === "video") {
        setUploading(true);
        const uploadedVideo = await uploadVideoFile();
        setUploading(false);

        payload.caption = caption.trim();
        payload.video = uploadedVideo;
      }

      const res = await api.post(`/groups/${groupId}/posts`, payload);

      toast.success("Post created");
      resetForm();

      onCreated?.(res.data.item);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Post failed");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4 space-y-4">
        <Tabs value={type} onValueChange={(v) => setType(v as PostType)}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="text">
              <Type className="w-4 h-4 mr-1" /> Text
            </TabsTrigger>
            <TabsTrigger value="image">
              <ImageIcon className="w-4 h-4 mr-1" /> Image
            </TabsTrigger>
            <TabsTrigger value="video">
              <VideoIcon className="w-4 h-4 mr-1" /> Video
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {type === "text" && (
          <Textarea
            placeholder="Write something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}

        {type === "image" && (
          <div className="space-y-3">
            <Textarea
              placeholder="Write caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setImages(e.target.files ? Array.from(e.target.files) : [])
              }
            />

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    className="rounded-xl object-cover h-24 w-full"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {type === "video" && (
          <div className="space-y-3">
            <Textarea
              placeholder="Write caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files?.[0] || null)}
            />

            {video && (
              <video
                src={URL.createObjectURL(video)}
                controls
                className="rounded-xl max-h-60 w-full"
              />
            )}
          </div>
        )}

        <Button onClick={handleSubmit} disabled={loading || uploading} className="w-full">
          {uploading
            ? "Uploading..."
            : loading
            ? "Posting..."
            : "Post"}
        </Button>
      </CardContent>
    </Card>
  );
}