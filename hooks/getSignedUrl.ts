import api from "@/lib/api";

export type GetSignedUrlResponse = { ok: boolean; url: string };

export async function getSignedUrl(key: string) {
  console.log("key",key);
  
  const res = await api.get<GetSignedUrlResponse>("/upload/signed", {

    params: { key },
  });

  console.log("main data",res.data);
  
  return res.data; // { ok, url }
}

