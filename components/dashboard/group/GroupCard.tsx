"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Lock, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GroupCardProps {
  item: any;
}

export function GroupCard({ item }: GroupCardProps) {
  const group = item.group;

  return (
    <Link
      href={`/dashboard/groups/${group._id}`}
      className="block rounded-xl border bg-white hover:shadow-md transition"
    >
      {/* Cover */}
      <div className="relative h-32 w-full rounded-t-xl overflow-hidden bg-muted">
        {group.coverUrl?.url ? (
          <Image
            src={group.coverUrl.url}
            alt={group.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No Cover
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight line-clamp-2">
            {group.name}
          </h3>

          <Badge variant="outline" className="capitalize text-xs">
            {item.role}
          </Badge>
        </div>

        {/* Privacy */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {group.privacy === "private" ? (
            <>
              <Lock className="h-4 w-4" />
              Private
            </>
          ) : (
            <>
              <Globe className="h-4 w-4" />
              Public
            </>
          )}
        </div>

        {/* Counts */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{group.counts?.members || 0} members</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
