import { createSlice } from "@reduxjs/toolkit";

// Initial state for the user slice
const initialUserState = {
  currentUser: null,
  loading: false,
  error: false,
};

// Creating the slice
export const userStateSlice = createSlice({
  name: "userState", // name of the slice
  initialState: initialUserState,
  reducers: {
    // reducer runs when login starts
    beginLogin: (state) => {
      state.loading = true;
    },

    loginComplete: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },

    loginError: (state) => {
      state.loading = false;
      state.error = true;
    },

    // When the user logs out
    signOut: (state) => {
      state.currentUser = null; // Remove user data
      state.loading = false;
      state.error = false;
    },

    toggleSubscription: (state, action) => {
      const channelId = action.payload; // Channel ID to sub/unsub

      if (state.currentUser.subscribedUsers.includes(channelId)) {
        state.currentUser.subscribedUsers.splice(
          state.currentUser.subscribedUsers.findIndex((id) => id === channelId),
          1
        );
      } else {
        state.currentUser.subscribedUsers.push(channelId);
      }
    },
  },
});

// Exporting the actions to use them in components
export const {
  beginLogin,
  loginComplete,
  loginError,
  signOut,
  toggleSubscription,
} = userStateSlice.actions;
// Exporting the reducer to add it to the Redux store
export default userStateSlice.reducer;
