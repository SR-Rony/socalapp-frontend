"use client";

import { GroupCard } from "./GroupCard";
import { Skeleton } from "@/components/ui/skeleton";

interface GroupGridProps {
  groups: any[];
  loading: boolean;
}

export function GroupGrid({ groups, loading }: GroupGridProps) {
    


  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-white overflow-hidden"
          >
            <Skeleton className="h-32 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!groups.length) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center text-muted-foreground">
        No groups found
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((item) => (
        <GroupCard key={item._id} item={item} />
      ))}
    </div>
  );
}
