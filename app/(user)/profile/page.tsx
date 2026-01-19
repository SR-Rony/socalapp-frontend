"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

/* =======================
   Types
======================= */
type Profile = {
  name: string;
  username: string;
  country?: string;
  address?: {
    fullAddress?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
};

/* =======================
   Page
======================= */
export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  /* =======================
     Fetch my profile
  ======================= */
  const fetchMe = async () => {
    try {
      const res = await api.get("/users/me");

      console.log("user data",res.data);
      
      if (res.data?.success) {
        setProfile(res.data.data);
      }
    } catch (err) {
      toast.error("Profile load failed");
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  /* =======================
     Update profile
  ======================= */
  const updateProfile = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const res = await api.patch("/users/me", {
        name: profile.name,
        country: profile.country,
        address: profile.address,
        contact: profile.contact,
      });

      if (res.data?.ok) {
        toast.success("Profile updated successfully");
        fetchMe(); // refresh data
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <p className="text-muted-foreground">Loading profile...</p>;
  }

  /* =======================
     UI
  ======================= */
  return (
    <div className="max-w-3xl space-y-8 container mx-auto bg-white p-4 mt-5 rounded-xl">
      <h1 className="text-2xl font-semibold">My Profile</h1>

      {/* ===== Basic Info ===== */}
      <div className=" rounded-xl border space-y-4">
        <h2 className="font-medium">Basic Information</h2>

        <div>
          <Label>Name</Label>
          <Input
            value={profile.name}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Username</Label>
          <Input value={profile.username} disabled />
        </div>

        <div>
          <Label>Country</Label>
          <Input
            value={profile.country || ""}
            onChange={(e) =>
              setProfile({ ...profile, country: e.target.value })
            }
          />
        </div>
      </div>

      {/* ===== Address ===== */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="font-medium">Address</h2>

        <Input
          placeholder="Full address"
          value={profile.address?.fullAddress || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              address: { ...profile.address, fullAddress: e.target.value },
            })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="City"
            value={profile.address?.city || ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                address: { ...profile.address, city: e.target.value },
              })
            }
          />
          <Input
            placeholder="State"
            value={profile.address?.state || ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                address: { ...profile.address, state: e.target.value },
              })
            }
          />
        </div>
      </div>

      {/* ===== Contact ===== */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="font-medium">Contact</h2>

        <Input
          placeholder="Phone"
          value={profile.contact?.phone || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              contact: { ...profile.contact, phone: e.target.value },
            })
          }
        />

        <Input
          placeholder="Website"
          value={profile.contact?.website || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              contact: { ...profile.contact, website: e.target.value },
            })
          }
        />
      </div>

      {/* ===== Action ===== */}
      <div className="flex justify-end">
        <Button onClick={updateProfile} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
