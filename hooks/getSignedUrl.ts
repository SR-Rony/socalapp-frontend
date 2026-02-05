import api from "@/lib/api";

export type GetSignedUrlResponse = { ok: boolean; url: string };

export async function getSignedUrl(key: string) {

  const res = await api.get<GetSignedUrlResponse>("/upload/signed", {
    params: { key },
  });

  return res.data; // { ok, url }
}