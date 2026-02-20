export type VideoItem = {
  _id: string;
  text?: string;
  medias?: {
    url: string;
    key?: string;
    provider?: string;
    thumbnailUrl?: string;
    durationSec?: number;
  }[];
  author?: {
    username?: string;
    avatar?: {
      url?: string;
      key?: string;
      provider?: string;
    };
  };
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  viewCount?: number;
  isLiked?: boolean;
  createdAt?: string | number | Date;
  
  subCategory?: string; // ✅ add this line
};