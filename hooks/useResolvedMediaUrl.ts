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







// // hooks/useResolvedMediaUrl.ts
// "use client";

// import { useEffect, useState } from "react";
// import api from "@/lib/api";

// type Args = {
//   keyPath?: string;
//   provider?: string;
//   url?: string;
// };


// export function useResolvedMediaUrl({ keyPath, provider, url }: Args) {
//   const [finalUrl, setFinalUrl] = useState<string>("");

//   useEffect(() => {
//     let ignore = false;

//     const resolve = async () => {
//       // ✅ Wasabi → ONLY signed url
//       if (provider === "wasabi" && keyPath) {
//         try {
//           const res = await api.get("/upload/signed", {
//             params: { key: keyPath },
//           });

//           if (!ignore) setFinalUrl(res.data.url);
//         } catch (err) {
//           console.error("Signed URL fetch failed:", err);
//           if (!ignore) setFinalUrl("");
//         }
//       } else {
//         // ✅ non-wasabi (cloudinary / public)
//         setFinalUrl(url || "");
//       }
//     };

//     resolve();
//     return () => {
//       ignore = true;
//     };
//   }, [keyPath, provider, url]);

//   return finalUrl;
// }

// export function useResolvedMediaUrl({ keyPath, provider, url }: Args) {
//   const [finalUrl, setFinalUrl] = useState<string>("");

//   useEffect(() => {
//     let ignore = false;

//     const resolve = async () => {
//       // ✅ Wasabi provider হলে signed URL fetch কর
//       if (provider === "wasabi" && keyPath) {
//         try {
//           const res = await api.get("/upload/signed", {
//             params: { key: keyPath },
//           });

//           if (!ignore) setFinalUrl(res.data.url);
//         } catch (err) {
//           console.error("Signed URL fetch failed:", err);
//           if (!ignore) setFinalUrl(url || "");
//         }
//       } else {
//         // অন্যথায় direct url
//         setFinalUrl(url || "");
//       }
//     };

//     resolve();
//     return () => {
//       ignore = true;
//     };
//   }, [keyPath, provider, url]);

//   return finalUrl;
// }






// // hooks/useResolvedMediaUrl.ts
// "use client";

// import { useEffect, useState } from "react";
// import api from "@/lib/api";

// type Args = {
//   keyPath?: string;
//   provider?: string;
//   url?: string;
// };


// export function useResolvedMediaUrl({ keyPath, provider, url }: Args) {
//   const [finalUrl, setFinalUrl] = useState<string>("");

//   useEffect(() => {
//     let ignore = false;

//     const resolve = async () => {
//       // ✅ Wasabi → ONLY signed url
//       if (provider === "wasabi" && keyPath) {
//         try {
//           const res = await api.get("/upload/signed", {
//             params: { key: keyPath },
//           });

//           if (!ignore) setFinalUrl(res.data.url);
//         } catch (err) {
//           console.error("Signed URL fetch failed:", err);
//           if (!ignore) setFinalUrl("");
//         }
//       } else {
//         // ✅ non-wasabi (cloudinary / public)
//         setFinalUrl(url || "");
//       }
//     };

//     resolve();
//     return () => {
//       ignore = true;
//     };
//   }, [keyPath, provider, url]);

//   return finalUrl;
// }

// export function useResolvedMediaUrl({ keyPath, provider, url }: Args) {
//   const [finalUrl, setFinalUrl] = useState<string>("");

//   useEffect(() => {
//     let ignore = false;

//     const resolve = async () => {
//       // ✅ Wasabi provider হলে signed URL fetch কর
//       if (provider === "wasabi" && keyPath) {
//         try {
//           const res = await api.get("/upload/signed", {
//             params: { key: keyPath },
//           });

//           if (!ignore) setFinalUrl(res.data.url);
//         } catch (err) {
//           console.error("Signed URL fetch failed:", err);
//           if (!ignore) setFinalUrl(url || "");
//         }
//       } else {
//         // অন্যথায় direct url
//         setFinalUrl(url || "");
//       }
//     };

//     resolve();
//     return () => {
//       ignore = true;
//     };
//   }, [keyPath, provider, url]);

//   return finalUrl;
// }


