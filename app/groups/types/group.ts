export type GroupDetails = {
  _id: string;
  name: string;
  slug: string;
  privacy: "public" | "private";
  coverUrl?: {
    url?: string;
    key?: string;
    provider?: string;
  };
  about?: string;
  category?: string;
  location?: {
    country?: string;
    city?: string;
  };
  counts: {
    members: number;
    posts: number;
  };
  isCreatedByMe: boolean;
  myMembership: null | {
    _id: string;
    status: "active" | "requested";
    role: "member" | "admin" | "mod";
    joinedAt: string;
  };
};