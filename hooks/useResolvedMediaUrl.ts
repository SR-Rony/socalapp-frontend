"use client";

import { useEffect, useMemo, useState } from "react";
import { getSignedUrl } from "./getSignedUrl";

type Args = {
  url?: string;          // public url fallback
  keyPath?: string;      // wasabi key
  provider?: "wasabi" | string;
};

export function useResolvedMediaUrl(args: Args) {
  const shouldSign = args.provider === "wasabi" && !!args.keyPath;

  const [signedUrl, setSignedUrl] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    // যদি sign লাগেই না, clear করে দাও
    if (!shouldSign) {
      setSignedUrl("");
      return;
    }

    (async () => {
      try {
        const data = await getSignedUrl(args.keyPath as string);
        // console.log('daa',data);
        
        if (!cancelled) setSignedUrl(data?.url || "");
      } catch {
        if (!cancelled) setSignedUrl("");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [shouldSign, args.keyPath]);

  const finalUri = useMemo(() => {
    if (shouldSign) return signedUrl || "";
    return args.url || "";
  }, [shouldSign, signedUrl, args.url]);


  // console.log('fainal url',finalUri);
  
  return finalUri;
}

