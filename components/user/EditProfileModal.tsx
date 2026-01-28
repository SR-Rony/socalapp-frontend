"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditProfileModal({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [country, setCountry] = useState(user.country || "");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);
      await api.patch("/users/me", {
        name,
        country,
      });
      window.location.reload();
    } catch (e) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Edit Profile
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold">Edit Profile</h2>

            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={submit} disabled={loading}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
