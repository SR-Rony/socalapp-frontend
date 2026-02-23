"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignedImage } from "@/components/common/SignedImage";
import { toast } from "sonner";

type Cursor = {
  createdAt: string;
  _id: string;
} | null;

type RequestItem = {
  _id: string; // membershipId
  createdAt: string;
  user: {
    _id: string;
    name: string;
    avatarUrl?: string;
    avatarKey?: string;
  } | null;
};

export default function GroupJoinRequestsPage() {
  const { groupId } = useParams() as { groupId: string };

  const [items, setItems] = useState<RequestItem[]>([]);
  const [cursor, setCursor] = useState<Cursor>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // 📥 fetch requests
  const fetchRequests = async (isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);

      const res = await api.get(`/groups/${groupId}/join-requests`, {
        params: {
          limit: 12,
          cursor: cursor ? JSON.stringify(cursor) : undefined,
        },
      });

      if (res.data.success) {
        setItems((prev) =>
          isLoadMore ? [...prev, ...res.data.items] : res.data.items,
        );
        setCursor(res.data.nextCursor || null);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 🔁 infinite scroll
  useEffect(() => {
    if (!observerRef.current) return;

    const el = observerRef.current;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && cursor && !loadingMore) {
        fetchRequests(true);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [cursor, loadingMore]);

  // ✅ approve (UI only for now)
  const handleApprove = async (membershipId: string) => {
    try {
      // 👉 later connect API
      toast.success("Approved");

      // optimistic remove
      setItems((prev) => prev.filter((i) => i._id !== membershipId));
    } catch (err: any) {
      toast.error("Approve failed");
    }
  };

  // ❌ reject
  const handleReject = async (membershipId: string) => {
    try {
      // 👉 later connect API
      toast.success("Rejected");

      setItems((prev) => prev.filter((i) => i._id !== membershipId));
    } catch (err: any) {
      toast.error("Reject failed");
    }
  };

  // ⏳ loading skeleton
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <p className="text-center mt-10 text-muted-foreground">
        No pending join requests
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Join Requests</h1>

      {items.map((req) => (
        <Card key={req._id}>
          <CardContent className="p-4 flex items-center justify-between">
            {/* 👤 user */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                {/* {req.user?.avatarUrl ? (
                  <SignedImage
                    url={req.user.avatarUrl}
                    keyPath={req.user.avatarKey}
                    className="w-full h-full object-cover"
                  />
                ) : null} */}
              </div>

              <div>
                <p className="font-medium">{req.user?.name || "Unknown user"}</p>
                <p className="text-xs text-muted-foreground">
                  Requested to join
                </p>
              </div>
            </div>

            {/* actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleApprove(req._id)}
              >
                Approve
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleReject(req._id)}
              >
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* 👀 observer */}
      <div ref={observerRef} className="h-10 flex justify-center items-center">
        {loadingMore && <p className="text-sm">Loading more...</p>}
      </div>
    </div>
  );
}