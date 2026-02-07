"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, ImageIcon, Video } from "lucide-react";
import { toast } from "sonner";

/* ======================
   Types
====================== */
type StoryType = "text" | "image" | "video";
type Privacy = "public" | "friends" | "only_me";

export default function StoryComposer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [type, setType] = useState<StoryType>("text");
  const [privacy, setPrivacy] = useState<Privacy>("public");

  const [text, setText] = useState("");
  const [backgroundUrl, setBackgroundUrl] = useState("");

  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);

  /* ======================
     Submit
  ====================== */
  const submitStory = async () => {
    try {
      setLoading(true);

      const payload: any = {
        type,
        privacy,
      };

      if (type === "text") {
        if (!text.trim()) {
          toast.error("Text is required");
          return;
        }
        payload.text = text;
        payload.backgroundUrl = backgroundUrl;
        payload.textStyle = { align: "center" };
      } else {
        if (!mediaUrl) {
          toast.error("Media URL required");
          return;
        }
        payload.media = {
          url: mediaUrl,
          provider: "wasabi",
        };
      }

      await api.post("/stories", payload);

      toast.success("Story posted 🎉");
      onClose();
      reset();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Story failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setText("");
    setMediaUrl("");
    setBackgroundUrl("");
    setType("text");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">

        {/* HEADER */}
        <div className="border-b p-4 font-semibold text-center">
          Create Story
        </div>

        {/* TYPE SWITCH */}
        <div className="flex gap-2 p-3">
          <Button
            variant={type === "text" ? "default" : "outline"}
            onClick={() => setType("text")}
            className="flex-1"
          >
            Text
          </Button>
          <Button
            variant={type === "image" ? "default" : "outline"}
            onClick={() => setType("image")}
            className="flex-1"
          >
            <ImageIcon size={16} className="mr-1" /> Image
          </Button>
          <Button
            variant={type === "video" ? "default" : "outline"}
            onClick={() => setType("video")}
            className="flex-1"
          >
            <Video size={16} className="mr-1" /> Video
          </Button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-3">

          {/* TEXT STORY */}
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

          {/* IMAGE / VIDEO */}
          {type !== "text" && (
            <>
              <input
                placeholder="Media URL"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full rounded border px-3 py-2 text-sm"
              />

              <div className="rounded border border-dashed p-4 text-center text-sm text-muted-foreground">
                <Upload className="mx-auto mb-1" size={18} />
                Upload integration next step
              </div>
            </>
          )}

          {/* PRIVACY */}
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
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submitStory} disabled={loading}>
            {loading ? "Posting..." : "Share"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
