import api from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

type JoinState = "idle" | "joining" | "joined" | "requested";

export function useJoinGroup(initialState: JoinState = "idle") {
  const [state, setState] = useState<JoinState>(initialState);
  const [loading, setLoading] = useState(false);

  const join = async (groupId: string): Promise<JoinState | null> => {
    if (loading) return null;

    setLoading(true);
    setState("joining");

    try {
      const res = await api.post(`/groups/${groupId}/join`);

      if (res.data.success) {
        const status = res.data.data?.status;

        if (status === "active") {
          setState("joined");
          toast.success("Joined group");
          return "joined";
        } else {
          setState("requested");
          toast.success("Join request sent");
          return "requested";
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Join failed");
      setState("idle");
    } finally {
      setLoading(false);
    }

    return null;
  };

  return { state, loading, join };
}