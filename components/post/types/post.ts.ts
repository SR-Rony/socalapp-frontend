export type Media = {
  type: "image" | "video";
  key?: string;
  url?: string;
  provider?: string;
};

export type PostData = {
  _id: string;
  authorId: string;
  user: {
    userId: string;
    name: string;
    avatar?: Media;
  };
  time: string;
  content: string;
  media?: Media | null;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  isShared: boolean;
};