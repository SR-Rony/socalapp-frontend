import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Story = {
  _id: string;
  userId: string;
  type: "text" | "image" | "video";
  text?: string;
  media?: any;
  privacy: string;
  createdAt: string;
};

type StoryState = {
  stories: Story[];
};

const initialState: StoryState = {
  stories: [],
};

export const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    addStory: (state, action: PayloadAction<Story>) => {
      // Prevent duplicates
      const exists = state.stories.find((s) => s._id === action.payload._id);
      if (!exists) state.stories.unshift(action.payload);
    },
    setStories: (state, action: PayloadAction<Story[]>) => {
      state.stories = action.payload;
    },
    clearStories: (state) => {
      state.stories = [];
    },
  },
});

export const { addStory, setStories, clearStories } = storySlice.actions;
export default storySlice.reducer;
