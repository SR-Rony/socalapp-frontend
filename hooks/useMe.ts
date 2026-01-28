import { useEffect, useState } from "react";
import { getMe } from "@/services/user.service";

export const useMe = () => {
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(res => setMe(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return { me, loading };
};
