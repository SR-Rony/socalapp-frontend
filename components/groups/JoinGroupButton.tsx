"use client";

import { Button } from "@/components/ui/button";
import { useJoinGroup } from "@/hooks/useJoinGroup";

type Props = {
  groupId: string;
  initialState?: "idle" | "joined" | "requested";
  onJoined?: () => void; // ✅ add this
};

export default function JoinGroupButton({
  groupId,
  initialState = "idle",
  onJoined,
}: Props) {
  const { state, loading, join } = useJoinGroup(initialState);

  const handleJoin = async () => {
    const result = await join(groupId);

    // ✅ only remove card when actually joined/requested
    if (result === "joined" || result === "requested") {
      onJoined?.();
    }
  };

  if (state === "joined") {
    return (
      <Button className="w-full" variant="secondary" disabled>
        Joined
      </Button>
    );
  }

  if (state === "requested") {
    return (
      <Button className="w-full" variant="outline" disabled>
        Requested
      </Button>
    );
  }

  return (
    <Button className="w-full" disabled={loading} onClick={handleJoin}>
      {loading ? "Joining..." : "Join"}
    </Button>
  );
}