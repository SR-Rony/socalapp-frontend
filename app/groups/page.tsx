"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedImage } from "@/components/common/SignedImage";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Lock, Globe } from "lucide-react";
import JoinGroupButton from "@/components/groups/JoinGroupButton";

/* ================= TYPES ================= */

type MyGroup = {
  section: number;
  status: "active" | "requested";
  _id: string;
  group: {
    _id: string;
    name: string;
    privacy: string;
    counts?: { members?: number };
    category?: string;
    coverUrl?: {
      url?: string;
      key?: string;
      provider?: string;
    };
  };
};

type SuggestedGroup = {
  _id: string;
  name: string;
  privacy: "public" | "private";
  counts: { members: number };
  mutualCount: number;
  coverUrl?: {
    url?: string;
    key?: string;
    provider?: string;
  };
};

type Cursor = {
  score: number;
  createdAt: string;
  _id: string;
} | null;

/* ================= PAGE ================= */

export default function GroupsHomePage() {
  /* ---------- My groups ---------- */
  const [myGroups, setMyGroups] = useState<MyGroup[]>([]);
  const [loadingMy, setLoadingMy] = useState(true);

  /* ---------- Suggested groups ---------- */
  const [suggested, setSuggested] = useState<SuggestedGroup[]>([]);
  const [cursor, setCursor] = useState<Cursor>(null);
  const [loadingSug, setLoadingSug] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  /* ================= FETCH MY GROUPS ================= */
  const fetchMyGroups = async () => {
    try {
      const res = await api.get("/groups/my", { params: { limit: 10 } });
      if (res.data.success) setMyGroups(res.data.items);
    } finally {
      setLoadingMy(false);
    }
  };

  /* ================= FETCH SUGGESTED ================= */
  const fetchSuggested = async (isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);

      const res = await api.get("/groups/for-you", {
        params: {
          limit: 9,
          cursor: cursor ? JSON.stringify(cursor) : undefined,
        },
      });

      if (res.data.success) {
        setSuggested((prev) =>
          isLoadMore ? [...prev, ...res.data.items] : res.data.items
        );
        setCursor(res.data.nextCursor || null);
      }
    } finally {
      setLoadingSug(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchMyGroups();
    fetchSuggested();
  }, []);

  /* ================= INFINITE SCROLL SUGGESTED ================= */
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && cursor && !loadingMore) {
        fetchSuggested(true);
      }
    });

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [cursor, loadingMore]);

  /* ================= UI HELPERS ================= */
  const sectionLabel = (s: number) =>
    s === 0 ? "Created by you" : "Joined";

  /* ================= LOADING ================= */
  if (loadingMy && loadingSug) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-10 bg-white rounded-xl">

      {/* ===================================================== */}
      {/* 🧑‍🤝‍🧑 MY GROUPS */}
      {/* ===================================================== */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Your Groups</h1>
          <div className="text-center space-y-3">
              <Link href="/groups/create">
                <Button>Create Group</Button>
              </Link>
            </div>
        </div>

          <div className="grid md:grid-cols-3 gap-4">
            {myGroups.map((item) => (
              <Card key={item._id} className="overflow-hidden">
                <Link href={`/groups/${item.group._id}`}>
                  <div className="h-28 bg-muted">
                    {item.group.coverUrl?.url && (
                      <SignedImage
                        keyPath={item.group.coverUrl?.key}
                        url={item.group.coverUrl?.url}
                        provider={item.group.coverUrl?.provider}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </Link>

                <CardContent className="p-4 space-y-2">
                  {/* name */}
                  <Link href={`/groups/${item.group._id}`}>
                    <h3 className="font-semibold line-clamp-1">
                      {item.group.name}
                    </h3>
                  </Link>

                  {/* privacy + members */}
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    {item.group.privacy === "private" ? (
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
                      {item.group.counts?.members || 0}
                    </span>
                  </div>

                  {/* badges */}
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 bg-muted rounded">
                      {item.section === 0 ? "Created by you" : "Joined"}
                    </span>

                    {item.status === "requested" && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* action */}
                  <Link href={`/groups/${item.group._id}`}>
                    <Button size="sm" className="w-full">
                      View Group
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
      </div>

      {/* ===================================================== */}
      {/* ⭐ SUGGESTED GROUPS */}
      {/* ===================================================== */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Suggested for you</h2>

        {!suggested.length ? (
          <p className="text-muted-foreground">
            No group suggestions right now
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {suggested.map((group) => (
              <Card key={group._id} className="overflow-hidden">
                <Link href={`/groups/${group._id}`}>
                  <div className="h-28 bg-muted">
                    {group.coverUrl?.url && (
                      <SignedImage
                        keyPath={group.coverUrl?.key}
                        url={group.coverUrl?.url}
                        provider={group.coverUrl?.provider}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </Link>

                <CardContent className="p-4 space-y-2">
                  <Link href={`/groups/${group._id}`}>
                    <h3 className="font-semibold line-clamp-1">
                      {group.name}
                    </h3>
                  </Link>

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

                  <JoinGroupButton
                    groupId={group._id}
                    onJoined={() =>
                      setSuggested((prev) =>
                        prev.filter((g) => g._id !== group._id)
                      )
                    }
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div ref={observerRef} className="h-10 flex justify-center items-center">
          {loadingMore && <p className="text-sm">Loading more...</p>}
        </div>
      </div>
    </div>
  );
}