"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";

export default function GroupSettingsPage() {
  const { groupId } = useParams();

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">
        Group Settings
      </h1>

      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          Group ID: {groupId}
        </p>

        <p>Privacy, rules, members (next step)</p>
      </Card>
    </div>
  );
}
