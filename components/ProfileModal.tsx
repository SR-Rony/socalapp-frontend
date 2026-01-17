"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";
import Link from "next/link";

export default function ProfileModal({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/me");
      if (res.data?.success) setProfile(res.data.data);
    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    if (open) fetchProfile();
  }, [open]);

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const res = await api.patch("/users/me", {
        name: profile.name,
        country: profile.country,
        contact: profile.contact,
      });
      if (res.data?.ok) {
        toast.success("Profile updated");
        fetchProfile();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>My Profile</DialogTitle>
        </DialogHeader>

        {/* Basic Info */}
        <div className="space-y-4 mt-2">
          <div>
            <Label>Name</Label>
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div>
            <Label>Country</Label>
            <Input
              value={profile.country || ""}
              onChange={(e) => setProfile({ ...profile, country: e.target.value })}
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              value={profile.contact?.phone || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  contact: { ...profile.contact, phone: e.target.value },
                })
              }
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>

          <Link
            href="/profile"
            className="text-center text-sm text-primary hover:underline w-full"
          >
            Open Full Profile
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
