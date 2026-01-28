"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { groupPostService } from "@/services/groupPost.service";
import { toast } from "sonner";

interface Props {
  groupId: string;
  onCreated?: () => void;
}

export default function GroupPostComposer({
  groupId,
  onCreated,
}: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!text.trim()) {
      toast.error("Write something");
      return;
    }

    try {
      setLoading(true);

      await groupPostService.createPost(groupId, {
        type: "text",
        text,
      });

      setText("");
      toast.success("Post created");
      onCreated?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <Textarea
        placeholder="Write something in this group..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex justify-end">
        <Button onClick={submit} disabled={loading}>
          Post
        </Button>
      </div>
    </Card>
  );
}
