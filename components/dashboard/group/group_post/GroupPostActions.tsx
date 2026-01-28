"use client";

import { Button } from "@/components/ui/button";
import { groupPostService } from "@/services/groupPost.service";
import { toast } from "sonner";

export default function GroupPostActions({
  post,
  groupId,
  onChanged,
}: any) {
  const remove = async () => {
    if (!confirm("Delete this post?")) return;

    await groupPostService.deletePost(groupId, post._id);
    toast.success("Deleted");
    onChanged();
  };

  return (
    <div className="flex gap-2 text-xs">
      <Button variant="ghost" size="sm">
        Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={remove}
      >
        Delete
      </Button>
    </div>
  );
}
