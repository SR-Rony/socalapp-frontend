"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Lock, Globe } from "lucide-react";
import { toast } from "sonner";
import { SignedImage } from "@/components/common/SignedImage";
import Link from "next/link";
import JoinGroupButton from "@/components/groups/JoinGroupButton";

type Cursor = {
  score: number;
  createdAt: string;
  _id: string;
} | null;

type ForYouGroup = {
  _id: string;
  name: string;
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
  mutualCount: number;
  score: number;
};

export default function ForYouGroupsPage() {
  const [groups, setGroups] = useState<ForYouGroup[]>([]);
  const [cursor, setCursor] = useState<Cursor>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // 📥 fetch groups
  const fetchGroups = async (isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);

      const res = await api.get("/groups/for-you", {
        params: {
          limit: 12,
          cursor: cursor ? JSON.stringify(cursor) : undefined,
        },
      });

      if (res.data.success) {
        setGroups((prev) =>
          isLoadMore ? [...prev, ...res.data.items] : res.data.items,
        );
        setCursor(res.data.nextCursor || null);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load groups");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // 🔁 infinite scroll
  useEffect(() => {
    if (!observerRef.current) return;

    const el = observerRef.current;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && cursor && !loadingMore) {
        fetchGroups(true);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [cursor, loadingMore]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-56 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (!groups.length) {
    return (
      <p className="text-center mt-10 text-muted-foreground">
        No group suggestions for you
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 mt-5">
      <h1 className="text-2xl font-bold text-center">Suggested for you</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {groups.map((group) => (
          <Card key={group._id} className="overflow-hidden">
            {/* 🖼 cover */}
            <Link href={`/groups/${group._id}`}>
              <div className="h-32 w-full bg-muted">
                {group.coverUrl?.url ? (
                <SignedImage
                    keyPath={group.coverUrl?.key}
                    url={group.coverUrl?.url}
                    provider={group.coverUrl?.provider}
                    alt="img"
                    className="h-full w-full object-cover"
                />
                ) : null}
              </div>
            </Link>

            <CardContent className="p-4 space-y-3">
              {/* name */}
              <Link href={`/groups/${group._id}`}>
                <h2 className="font-semibold line-clamp-1">{group.name}</h2>
              </Link>

              {/* privacy + members */}
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                {group.privacy === "private" ? (
                  <>
                    <Lock size={14} /> Private
                  </>
                ) : (
                  <>
                    <Globe size={14} /> Public
                  </>
                )}
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {group.counts.members}
                </span>
              </div>

              {/* mutual */}
              {group.mutualCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  {group.mutualCount} mutual members
                </p>
              )}

              {/* join button */}
              <JoinGroupButton
                groupId={group._id}
                onJoined={() =>
                    setGroups((prev) => prev.filter((g) => g._id !== group._id))
                }
                />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 👀 observer trigger */}
      <div ref={observerRef} className="h-10 flex items-center justify-center">
        {loadingMore && <p className="text-sm">Loading more...</p>}
      </div>
    </div>
  );
}