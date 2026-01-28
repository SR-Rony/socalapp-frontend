"use client";

import { useEffect, useState } from "react";
import { adminGroupService } from "@/services/admin.group.service";

export function useAdminGroups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await adminGroupService.getAllGroups({ limit: 200 });
      setGroups(res.data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return { groups, loading, refetch: fetchGroups };
}
