import { createSlice } from "@reduxjs/toolkit";

// initial state for video slice
const initialVideoState = {
  currentVideo: null,
  loading: false,
  error: false,
};

// Creating the slice
export const videoStateSlice = createSlice({
  name: "videoState",
  initialState: initialVideoState,
  reducers: {
    startFetch: (state) => {
      state.loading = true;
    },
    fetchDone: (state, action) => {
      state.loading = false;
      state.currentVideo = action.payload;
    },
    fetchError: (state) => {
      state.loading = false;
      state.error = true;
    },
    addLike: (state, action) => {
      const userId = action.payload;
      if (!state.currentVideo.likes.includes(userId)) {
        state.currentVideo.likes.push(userId);
        const dislikeIdx = state.currentVideo.dislikes.findIndex(
          (id) => id === userId
        );
        if (dislikeIdx !== -1) {
          state.currentVideo.dislikes.splice(dislikeIdx, 1);
        }
      }
    },
    addDislike: (state, action) => {
      const userId = action.payload;
      if (!state.currentVideo.dislikes.includes(userId)) {
        state.currentVideo.dislikes.push(userId);
        const likeIdx = state.currentVideo.likes.findIndex(
          (id) => id === userId
        );
        if (likeIdx !== -1) {
          state.currentVideo.likes.splice(likeIdx, 1);
        }
      }
    },
  },
});

// Exporting all the actions so we can use them in our components
export const { startFetch, fetchDone, fetchError, addLike, addDislike } =
  videoStateSlice.actions;

// Exporting the reducer so we can add it to Redux store
export default videoStateSlice.reducer;
