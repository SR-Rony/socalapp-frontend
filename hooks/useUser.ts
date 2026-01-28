import { useEffect, useState } from "react";
import { getUserById } from "@/services/user.service";

export const useUser = (userId: string) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getUserById(userId)
      .then(res => setUser(res.data.data))
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading };
};
