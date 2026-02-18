"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/redux/hook/hook";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { ImageIcon, Video } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { addStoryFeedItem } from "@/redux/features/storySlice";

// ======================
// Types
// ======================
type StoryType = "text" | "image" | "video";
type Privacy = "public" | "friends" | "only_me";

type MediaPayload = {
  url: string;
  key?: string;
  provider?: string;
};

interface StoryComposerProps {
  open: boolean;
  onClose: () => void;
}

// ======================
// Component
// ======================
export default function StoryComposer({ open, onClose }: StoryComposerProps) {
  const dispatch = useAppDispatch();
  const me = useAppSelector((s) => s.auth.user);

  const [type, setType] = useState<StoryType>("text");
  const [privacy, setPrivacy] = useState<Privacy>("public");
  const [text, setText] = useState<string>("");
  const [backgroundUrl, setBackgroundUrl] = useState<string>("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // ======================
  // File select
  // ======================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setMediaFile(e.target.files[0]);
  };

  // ======================
  // Upload file to Wasabi
  // ======================
  const uploadMedia = async (): Promise<MediaPayload | null> => {
    if (!mediaFile) return null;

    const formData = new FormData();
    formData.append("file", mediaFile);

    try {
      setMediaUploading(true);
      const endpoint = type === "image" ? "/upload/image" : "/upload/video";

      const res = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      

      if (res.data?.ok && res.data?.url) {
        // ✅ return both key & url
        return {
          url: res.data.url,
          key: res.data.key,
          provider: res.data.provider || "wasabi",
        };
      } else {
        toast.error(res.data?.message || "Upload failed");
        return null;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Upload failed");
      return null;
    } finally {
      setMediaUploading(false);
    }
  };

  // ======================
  // Submit Story
  // ======================
  const submitStory = async () => {
    if (loading) return;
    if (!me) return toast.error("Unauthorized");

    setLoading(true);

    try {
      let media: MediaPayload | undefined = undefined;

      if (type !== "text") {
        const uploaded = await uploadMedia();
        if (!uploaded) return;
        media = uploaded;
      }

      if (type === "text" && !text.trim()) {
        toast.error("Text required");
        return;
      }

      // ======================
      // Story payload
      // ======================
      const payload: any = { type, privacy };

      if (type === "text") {
        payload.text = text.trim();
        payload.backgroundUrl = backgroundUrl || "";
        payload.textStyle = { align: "center" };
      } else {
        payload.media = media;
      }

      // ======================
      // POST story
      // ======================
      const res = await api.post("/stories", payload);

      if (res.data?.success && res.data?.story) {
        const story = res.data.story;

        // ✅ Redux feed item
        const feedItem = {
          _id: story._id,
          ownerId: me._id,
          count: 1,
          isSeen: true,
          isMe: true,
          owner: {
            _id: me._id,
            name: me.name,
            avatar: me.avatar,
          },
          lastStory: story,
        };

        dispatch(addStoryFeedItem(feedItem));
        toast.success("Story posted 🎉");
        reset();
        onClose();
      } else {
        toast.error("Story failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Story failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setText("");
    setBackgroundUrl("");
    setMediaFile(null);
    setType("text");
  };

  // ======================
  // Render
  // ======================
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* HEADER */}
        <div className="border-b p-4 text-center font-semibold">
          Create Story
        </div>

        {/* TYPE BUTTONS */}
        <div className="flex gap-2 p-3">
          <Button
            type="button"
            variant={type === "text" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setType("text")}
          >
            Text
          </Button>
          <Button
            type="button"
            variant={type === "image" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setType("image")}
          >
            <ImageIcon size={16} className="mr-1" /> Image
          </Button>
          <Button
            type="button"
            variant={type === "video" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setType("video")}
          >
            <Video size={16} className="mr-1" /> Video
          </Button>
        </div>

        {/* BODY */}
        <div className="flex flex-col space-y-3 p-4">
          {type === "text" && (
            <>
              <Textarea
                placeholder="Write something..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={500}
              />
              <input
                placeholder="Background image url (optional)"
                value={backgroundUrl}
                onChange={(e) => setBackgroundUrl(e.target.value)}
                className="w-full rounded border px-3 py-2 text-sm"
              />
            </>
          )}

          {type !== "text" && (
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept={type === "image" ? "image/*" : "video/*"}
                onChange={handleFileChange}
                className="w-full rounded border px-3 py-2 text-sm"
              />
              <div className="min-h-[18px] text-xs text-muted-foreground">
                {mediaUploading && "Uploading..."}
              </div>
            </div>
          )}

          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value as Privacy)}
            className="w-full rounded border px-3 py-2 text-sm"
          >
            <option value="public">Public</option>
            <option value="friends">Friends</option>
            <option value="only_me">Only me</option>
          </select>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 border-t p-4">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            onClick={submitStory}
            disabled={loading || mediaUploading}
            type="button"
          >
            {loading ? "Posting..." : "Share"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
