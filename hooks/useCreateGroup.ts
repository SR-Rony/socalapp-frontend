"use client";

import { useState } from "react";
import { groupService } from "@/services/group.service";

export function useCreateGroup(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const createGroup = async (data: any) => {
    try {
      setLoading(true);
      await groupService.createGroup(data);
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return { createGroup, loading };
}
