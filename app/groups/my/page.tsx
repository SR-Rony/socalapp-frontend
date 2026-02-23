"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedImage } from "@/components/common/SignedImage";

type GroupItem = {
  section: number; // 0 created, 1 joined
  status: "active" | "requested";
  role: string;
  membershipId: string | null;
  createdAt: string;
  _id: string;
  group: {
    _id: string;
    name: string;
    slug: string;
    privacy: string;
    counts?: { members?: number; posts?: number };
    category?: string;
    coverUrl?: {
      url?: string
      key?: string
      provider?: string
}
  };
};

export default function MyGroupsPage() {
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<any>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // ===============================
  // fetch groups
  // ===============================
  const fetchGroups = async (cursor?: any) => {
    try {
      const res = await api.get("/groups/my", {
        params: {
          limit: 10,
          cursor: cursor ? JSON.stringify(cursor) : undefined,
        },
      });

      if (res.data.success) {
        if (cursor) {
          setGroups((prev) => [...prev, ...res.data.items]);
        } else {
          setGroups(res.data.items);
        }

        setNextCursor(res.data.nextCursor);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // ===============================
  // load more
  // ===============================
  const handleLoadMore = () => {
    if (!nextCursor) return;
    setLoadingMore(true);
    fetchGroups(nextCursor);
  };

  // ===============================
  // UI helpers
  // ===============================
  const sectionLabel = (s: number) =>
    s === 0 ? "Created by you" : "Joined";

  const statusColor = (status: string) =>
    status === "active"
      ? "bg-green-100 text-green-600"
      : "bg-yellow-100 text-yellow-600";

  // ===============================
  // loading skeleton
  // ===============================
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse h-24 bg-gray-200 rounded-xl"
          />
        ))}
      </div>
    );
  }

  // ===============================
  // empty state
  // ===============================
  if (!groups.length) {
    return (
      <div className="max-w-xl mx-auto p-10 text-center space-y-4">
        <h2 className="text-xl font-semibold">No groups yet</h2>
        <p className="text-gray-500">
          Create a group or join one to see it here.
        </p>
        <Link href="/groups/create">
          <Button>Create Group</Button>
        </Link>
      </div>
    );
  }

  // ===============================
  // main UI
  // ===============================
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Your Groups</h1>

      {groups.map((item) => (
        <Link
          key={`${item.section}-${item._id}`}
          href={`/groups/${item.group._id}`}
          className="block"
        >
          <div className="flex gap-4 p-4 border rounded-xl hover:bg-gray-50 transition">
            {/* cover */}
            <SignedImage
                keyPath={item.group.coverUrl?.key}
                url={item.group.coverUrl?.url}
                provider={item.group.coverUrl?.provider}
                alt="img"
                className="h-24 w-24 object-cover"
            />

            {/* info */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">
                  {item.group.name}
                </h3>

                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                  {sectionLabel(item.section)}
                </span>

                <span
                  className={`text-xs px-2 py-0.5 rounded ${statusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 capitalize">
                {item.group.privacy} group ·{" "}
                {item.group.counts?.members || 0} members
              </p>

              {item.group.category && (
                <p className="text-xs text-gray-400">
                  {item.group.category}
                </p>
              )}
            </div>

            {/* action */}
            <div className="flex items-center">
              {item.status === "requested" && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                  Pending
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}

      {/* load more */}
      {nextCursor && (
        <div className="text-center pt-4">
          <Button
            variant="secondary"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}