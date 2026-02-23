"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Lock, Globe } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { SignedImage } from "@/components/common/SignedImage";
import Link from "next/link";


type GroupDetails = {
  _id: string;
  name: string;
  slug: string;
  privacy: "public" | "private";
  coverUrl?: {
    url?: string;
    key?: string;
    provider?: string;
  };
  about?: string;
  category?: string;
  location?: {
    country?: string;
    city?: string;
  };
  counts: {
    members: number;
    posts: number;
  };
  isCreatedByMe: boolean;
  myMembership: null | {
    _id: string;
    status: "active" | "requested";
    role: "member" | "admin" | "mod";
    joinedAt: string;
  };
};

export default function GroupDetailsPage() {
  const { groupId } = useParams();
  

  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  // 📥 fetch group details
  const fetchGroup = async () => {
    try {
      const res = await api.get(`/groups/${groupId}/group-details`);
      if (res.data.success) {
        setGroup(res.data.group);
        
        
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load group");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) fetchGroup();
  }, [groupId]);

  // 🤝 join group
  const handleJoin = async () => {
    if (!group) return;

    try {
      setJoining(true);
      const res = await api.post(`/groups/${group._id}/join`);

      if (res.data.success) {
        toast.success(res.data.message || "Join request sent");

        // 🔄 optimistic UI update
        setGroup((prev) =>
          prev
            ? {
                ...prev,
                myMembership: {
                  _id: "temp",
                  status: res.data.status, // active / requested
                  role: "member",
                  joinedAt: new Date().toISOString(),
                },
                counts: {
                  ...prev.counts,
                  members:
                    res.data.status === "active"
                      ? prev.counts.members + 1
                      : prev.counts.members,
                },
              }
            : prev,
        );
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Join failed");
    } finally {
      setJoining(false);
    }
  };

  // 🧠 button label logic
  const renderJoinButton = () => {
    if (!group) return null;

    if (group.isCreatedByMe) {
      return <Button disabled>You are admin</Button>;
    }

    if (!group.myMembership) {
      return (
        <Button onClick={handleJoin} disabled={joining}>
          Join Group
        </Button>
      );
    }

    if (group.myMembership.status === "requested") {
      return <Button disabled>Requested</Button>;
    }

    if (group.myMembership.status === "active") {
      return <Button variant="secondary">Joined</Button>;
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!group) return <p className="text-center mt-10">Group not found</p>;

  return (
    <div className="max-w-5xl mx-auto space-y-4 mt-4">
      {/* 🖼 Cover */}
      <div className="w-full h-64 bg-muted rounded-xl overflow-hidden">
        {group.coverUrl?.url ? (
        //   <SignedImage url={group.coverUrl.url} className="w-full h-full object-cover" />
        <SignedImage url={group.coverUrl.url} keyPath={group.coverUrl.key} provider={group.coverUrl.provider} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No cover
          </div>
        )}
      </div>

      {/* 📌 Header */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left */}
            <div>
              <h1 className="text-2xl font-bold">{group.name}</h1>

              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                {group.privacy === "private" ? (
                  <>
                    <Lock size={16} /> Private group
                  </>
                ) : (
                  <>
                    <Globe size={16} /> Public group
                  </>
                )}

                
                  <span className="flex items-center gap-1">
                    <Users size={16} />
                    {group.counts.members} members
                  </span>  

              </div>
            </div>

            {/* Right */}
            <div className="flex gap-2">{renderJoinButton()}</div>
          </div>
          {/* group member view button */}
          {group?.myMembership?.role === "admin" &&
            <Link href={`/groups/${group._id}/members`}>
              <Button className="cursor-pointer" variant="secondary">
                View Members
              </Button>
            </Link>
          }
        </CardContent>
      </Card>

      {/* 📑 Tabs section (basic) */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* 🧾 About */}
        <Card className="md:col-span-1">
          <CardContent className="p-4 space-y-3">
            <h2 className="font-semibold">About</h2>

            {group.about ? (
              <p className="text-sm text-muted-foreground">{group.about}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No description</p>
            )}

            {group.category && (
              <p className="text-sm">Category: {group.category}</p>
            )}

            {(group.location?.country || group.location?.city) && (
              <p className="text-sm">
                Location: {group.location.city}, {group.location.country}
              </p>
            )}
          </CardContent>
        </Card>

        {/* 📰 Discussion placeholder */}
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">Discussion</h2>
            <p className="text-sm text-muted-foreground">
              Group posts will appear here...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}