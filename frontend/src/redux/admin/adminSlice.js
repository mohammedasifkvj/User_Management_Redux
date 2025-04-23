import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'list',
    initialState: {
        users: []
    },
    reducers: {
        getUser: (state, action) => {
            state.users = Array.isArray(action.payload)
                ? action.payload.map(user => ({
                      id: user._id,
                      name: user.username,
                      email: user.email
                  }))
                : []; // Handle case where payload is not an array
        },
        signInStart: (state) => {
          state.loading = true;
        },
        signInSuccess: (state, action) => {
          state.currentUser = action.payload;
          state.loading = false;
          state.error = false;
        },
        signInFailure: (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
        updateUserStart: (state) => {
          state.loading = true;
        },
        updateUserSuccess: (state, action) => {
          state.currentUser = action.payload;
          state.loading = false;
          state.error = false;
        },
        updateUserFailure: (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
        deleteUserStart: (state) => {
          state.loading = true;
        },
        deleteUserSuccess: (state, action) => {
          state.users = state.users.filter((user) => user.id !== action.payload); // Remove deleted user
          state.loading = false;
          state.error = false;
        },        
        deleteUserFailure: (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
        assignTaskStart: (state) => {
          state.loading = true;
        },
        assignTaskSuccess: (state, action) => {
          state.currentUser = action.payload;
          state.loading = false;
          state.error = false;
        },
        assignTaskFailure: (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
        showTaskStart: (state) => {
          state.loading = true;
        },
        showTaskSuccess: (state, action) => {
          const userId = action.payload;
          const user = state.users.find(user => user.id === userId);
          if (user) {
            // Optionally mark the user as having tasks
            user.hasTasks = true;
          }
          // Do not remove the user from state.users
        },       
        showTaskFailure: (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
        signOut: (state) => {
          state.currentUser = null;
          state.loading = false;
          state.error = false;
        },
    },
});

export const { getUser ,
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  assignTaskStart,
  assignTaskSuccess,
  showTaskStart,
  showTaskSuccess,
  assignTaskFailure,
  showTaskFailure,
  signOut,
} = userSlice.actions;
export default userSlice.reducer;