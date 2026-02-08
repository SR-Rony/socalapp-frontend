// redux/features/storySlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ---------- Types ----------
export type MediaType = {
  url: string;
  key?: string;
  provider?: string;
  thumbnailUrl?: string;
};

export type Story = {
  _id: string;
  userId: string;
  type: "text" | "image" | "video";
  text?: string;
  media?: MediaType;
  privacy: "public" | "friends" | "only_me";
  createdAt: string;
};

export type UserAvatar = {
  url: string;
  key?: string;
  provider?: string;
};

export type StoryFeedItem = {
  _id: string;
  ownerId: string;
  count: number;
  isSeen: boolean;
  isMe: boolean;
  owner: {
    _id: string;
    name: string;
    avatar?: UserAvatar;
  };
  lastStory: Story;
};

// ---------- State ----------
type StoryState = {
  stories: StoryFeedItem[];
};

const initialState: StoryState = {
  stories: [],
};

// ---------- Slice ----------
export const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    setStories: (state, action: PayloadAction<StoryFeedItem[]>) => {
      state.stories = action.payload;
    },

    addStoryFeedItem: (state, action) => {
      const incoming = action.payload;

      const existing = state.stories.find(
        (s) => s.ownerId === incoming.ownerId
      );

      if (existing) {
        // ✅ same user → update
        existing.lastStory = incoming.lastStory;
        existing.count += 1;
        existing.isSeen = true;
      } else {
        // ✅ new user → add
        state.stories.unshift(incoming);
      }
    },

    clearStories: (state) => {
      state.stories = [];
    },
  },
});

export const {
  setStories,
  addStoryFeedItem,
  clearStories,
} = storySlice.actions;

export default storySlice.reducer;
