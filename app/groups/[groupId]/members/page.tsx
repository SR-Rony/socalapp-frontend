"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignedImage } from "@/components/common/SignedImage";
import { toast } from "sonner";
import clsx from "clsx";

type Status = "active" | "requested" | "rejected" | "blocked";

type Cursor = {
  createdAt: string;
  _id: string;
} | null;

type MemberItem = {
  membershipId: string;
  role: "member" | "admin" | "moderator" | "owner";
  status: Status;
  user: {
    _id: string;
    name: string;
    avatarUrl?: string;
    avatarKey?: string;
  };
};

export default function GroupMembersPage() {
  const { groupId } = useParams() as { groupId: string };

  const [status, setStatus] = useState<Status>("active");
  const [items, setItems] = useState<MemberItem[]>([]);
  const [cursor, setCursor] = useState<Cursor>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // 📥 fetch members
  const fetchMembers = async (
    isLoadMore = false,
    newStatus?: Status,
    reset = false,
  ) => {
    try {
      const s = newStatus || status;

      if (isLoadMore) setLoadingMore(true);
      else if (reset) setLoading(true);

      const res = await api.get(`/groups/${groupId}/members`, {
        params: {
          status: s,
          limit: 20,
          cursor: isLoadMore && cursor ? JSON.stringify(cursor) : undefined,
        },
      });

      if (res.data.success) {
        setItems((prev) =>
          isLoadMore ? [...prev, ...res.data.items] : res.data.items,
        );
        setCursor(res.data.nextCursor || null);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load members");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 🔄 status change (auto refetch)
  const handleStatusChange = (s: Status) => {
    setStatus(s);
    setCursor(null);
    fetchMembers(false, s, true);
  };

  // 🔁 first load
  useEffect(() => {
    fetchMembers(false, status, true);
  }, []);

  // 🔁 infinite scroll
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && cursor && !loadingMore) {
        fetchMembers(true);
      }
    });

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [cursor, loadingMore, status]);

  // 🔧 reusable status updater
  const updateStatus = async (membershipId: string, nextStatus: Status) => {
    try {
      await api.patch(
        `/groups/${groupId}/members/${membershipId}/status`,
        { status: nextStatus },
      );

      toast.success(
        nextStatus === "active"
          ? "Approved"
          : nextStatus === "rejected"
          ? "Rejected"
          : nextStatus === "blocked"
          ? "Blocked"
          : "Updated",
      );

      // optimistic remove from current tab
      setItems((prev) => prev.filter((i) => i.membershipId !== membershipId));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Action failed");

      // fallback refetch to keep UI correct
      fetchMembers(false, status, true);
    }
  };

  const handleApprove = (id: string) => updateStatus(id, "active");
  const handleReject = (id: string) => updateStatus(id, "rejected");
  const handleBlock = (id: string) => updateStatus(id, "blocked");
  const handleUnblock = (id: string) => updateStatus(id, "active");

  // ⭐ make admin
  const handleMakeAdmin = async (membershipId: string) => {

    alert(`member ship id ${membershipId}`)
    
    // try {
    //   await api.post(`/groups/${groupId}/members/${membershipId}/make-admin`);

    //   toast.success("Promoted to admin");

    //   setItems((prev) =>
    //     prev.map((i) =>
    //       i.membershipId === membershipId ? { ...i, role: "admin" } : i,
    //     ),
    //   );
    // } catch (err: any) {
    //   toast.error(err?.response?.data?.message || "Action failed");
    // }
  };

  // ⏳ skeleton
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 mt-4">
      <h1 className="text-xl font-bold text-center">Members</h1>

      {/* 🧭 Tabs */}
      <div className="flex gap-2">
        {(["active", "requested", "blocked"] as Status[]).map((s) => (
          <Button
            key={s}
            variant={status === s ? "default" : "secondary"}
            onClick={() => handleStatusChange(s)}
            className={clsx("capitalize")}
          >
            {s}
          </Button>
        ))}
      </div>

      {/* 📴 empty state */}
      {!items.length && (
        <p className="text-center text-muted-foreground mt-6">
          No {status} members
        </p>
      )}

      {/* 👥 list */}
      {items.map((m) => (
        <Card key={m.membershipId}>
          <CardContent className="p-4 flex items-center justify-between">
            {/* user */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                {m.user?.avatarUrl && (
                  <SignedImage
                    url={m.user.avatarUrl}
                    keyPath={m.user.avatarKey}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div>
                <p className="font-medium">{m.user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {m.role}
                </p>
              </div>
            </div>

            {/* actions */}
            <div className="flex gap-2">
              {/* requested tab */}
              {status === "requested" && (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleApprove(m.membershipId)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(m.membershipId)}
                  >
                    Reject
                  </Button>
                </>
              )}

              {/* active tab */}
              {status === "active" && m.role === "member" && (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleMakeAdmin(m.membershipId)}
                  >
                    Make Admin
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBlock(m.membershipId)}
                  >
                    Block
                  </Button>
                </>
              )}

              {/* blocked tab */}
              {status === "blocked" && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleUnblock(m.membershipId)}
                >
                  Unblock
                </Button>
              )}
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