"use client";

import { GroupGrid } from "@/components/dashboard/group/GroupGrid";
import { Button } from "@/components/ui/button";
import { useMyGroups } from "@/hooks/useMyGroups";
import Link from "next/link";

export default function GroupsPage() {
  const { groups, loading } = useMyGroups();

  return (
    <div className="space-y-5 bg-white rounded-xl p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-xl font-semibold">My Groups</h1>
            <p className="text-sm text-muted-foreground">
            Groups you created or joined
            </p>
        </div>
        <div>
            <Link href={'/dashboard/groups/create'}><Button>Create Group</Button></Link>
        </div>
      </div>

      {/* Grid */}
      <GroupGrid groups={groups} loading={loading} />
    </div>
  );
}
