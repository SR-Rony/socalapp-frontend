export type VideoItem = {
  _id: string;
  text?: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  medias: {
    url?: string;
    key?: string;
    provider?: string;
  }[];
  author: {
    _id: string;
    name: string;
    username: string;
    avatar?: { url?: string; key?: string; provider?: string };
  };
};
