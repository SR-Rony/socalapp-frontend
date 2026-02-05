"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import EditProfileModal from "./EditProfileModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  user: any;
  onUserUpdate?: (u: any) => void;
};

export default function ProfileInfo({ user, onUserUpdate }: Props) {
  const { address, contact, bio, country, isMe } = user;
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">About</h3>

        {isMe && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
          >
            Edit
          </Button>
        )}
      </div>

      {/* Bio */}
      {bio && <p className="text-sm text-muted-foreground">{bio}</p>}

      {/* Country */}
      {country && (
        <div className="text-sm">
          <span className="font-medium">Country:</span> {country}
        </div>
      )}

      {/* Address */}
      {address && (
        <div className="text-sm space-y-1">
          <div className="font-medium">Address</div>
          {address.fullAddress && <div>{address.fullAddress}</div>}
          {address.city && <div>{address.city}</div>}
          {address.state && <div>{address.state}</div>}
        </div>
      )}

      {/* Contact */}
      {contact && (
        <div className="text-sm space-y-1">
          <div className="font-medium">Contact</div>
          {contact.phone && <div>📞 {contact.phone}</div>}
          {contact.email && <div>✉️ {contact.email}</div>}
          {contact.website && <div>🌐 {contact.website}</div>}
        </div>
      )}

      {/* ===== Edit Modal ===== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>

          <EditProfileModal
            user={user}
            onUpdated={(u: any) => {
              onUserUpdate?.(u);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
