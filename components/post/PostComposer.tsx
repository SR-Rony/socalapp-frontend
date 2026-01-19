"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImageIcon, VideoIcon, Smile, X } from "lucide-react";
import { useAppSelector } from "@/redux/hook/hook";

export default function PostComposer() {
  const { user } = useAppSelector((state: any) => state.auth);
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Composer Card */}
      <Card className="w-full rounded-xl shadow-sm mb-3">
        <CardContent className="p-2 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src={user?.image || "/avatar.png"}
                alt={user?.name || "User"}
                fill
                className="rounded-full object-cover"
              />
            </div>

            {/* Input */}
            <Input
              readOnly
              onClick={() => setOpen(true)}
              placeholder={`What's on your mind, ${user?.name || "Rony"}?`}
              className="rounded-full bg-muted cursor-pointer"
            />
            <div className="flex gap-4">
                <VideoIcon className="text-red-500 " />
                <ImageIcon className="text-green-500" />
                <Smile className="text-yellow-500" />
            </div>
          </div>

          <Separator className="my-3" />
        </CardContent>
      </Card>

      {/* Full Seam-to-Seam Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-full h-[100dvh] sm:h-auto sm:max-w-xl p-0 rounded-none sm:rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-base font-semibold">Create post</h2>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="relative w-10 h-10">
              <Image
                src={user?.image || "/avatar.png"}
                alt={user?.name || "User"}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Public</p>
            </div>
          </div>

          {/* Textarea */}
          <div className="px-4">
            <textarea
              autoFocus
              placeholder={`What's on your mind, ${user?.name || "Rony"}?`}
              className="w-full min-h-[150px] resize-none outline-none text-base"
            />
          </div>

          {/* Actions */}
          <div className="px-4 py-3 border-t space-y-2">
            <div className="flex items-center justify-between rounded-lg border p-2">
              <span className="text-sm">Add to your post</span>
              <div className="flex items-center gap-2">
                <ImageIcon className="text-green-500" />
                <VideoIcon className="text-red-500" />
                <Smile className="text-yellow-500" />
              </div>
            </div>

            <Button className="w-full">Post</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Button variant="ghost" className="flex items-center justify-center gap-2 h-10 hover:bg-muted">
      {icon}
      <span className="hidden sm:inline text-sm font-medium text-muted-foreground">{label}</span>
    </Button>
  );
}
