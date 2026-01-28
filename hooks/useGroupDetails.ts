"use client";

import { useEffect, useState } from "react";
import { groupService } from "@/services/group.service";

export function useGroupDetails(groupId: string) {
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;

    groupService
      .getGroupDetails(groupId)
      .then((res) => setGroup(res.data.group))
      .finally(() => setLoading(false));
  }, [groupId]);

  return { group, loading };
}
