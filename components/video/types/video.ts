export type VideoItem = {
  _id: string;
  text?: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  viewCount?: number;
  medias: {
    url?: string;
    key?: string;
    provider?: string;
    thumbnailUrl?: string;
  // 🎬 add this
  durationSec?: number;
  }[];
  author: {
    _id: string;
    name: string;
    username: string;
    avatar?: { url?: string; key?: string; provider?: string };
  };
};
