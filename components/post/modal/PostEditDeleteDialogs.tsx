"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  editingPost: any;
  editText: string;
  setEditText: (v: string) => void;
  onCloseEdit: () => void;
  onSaveEdit: () => void;

  deletingId: string | null;
  onCloseDelete: () => void;
  onConfirmDelete: () => void;
};

export default function PostEditDeleteDialogs({
  editingPost,
  editText,
  setEditText,
  onCloseEdit,
  onSaveEdit,
  deletingId,
  onCloseDelete,
  onConfirmDelete,
}: Props) {
  return (
    <>
      {/* ✏️ EDIT DIALOG */}
      <Dialog open={!!editingPost} onOpenChange={onCloseEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit post</DialogTitle>
          </DialogHeader>

          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[120px]"
          />

          <DialogFooter>
            <Button variant="outline" onClick={onCloseEdit}>
              Cancel
            </Button>
            <Button onClick={onSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🗑️ DELETE DIALOG */}
      <Dialog open={!!deletingId} onOpenChange={onCloseDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete post?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            This will move your post to trash.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={onCloseDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}