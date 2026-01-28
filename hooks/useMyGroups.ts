"use client";

import { useEffect, useState } from "react";
import { groupService } from "@/services/group.service";

export function useMyGroups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    groupService
      .getMyGroups()
      .then((res) => setGroups(res.data.items))
      .finally(() => setLoading(false));
  }, []);

  return { groups, loading };
}
