import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    globalLoading: false,
    pendingRequests: 0,
  },
  reducers: {
    startGlobalLoading: (state) => {
      state.pendingRequests += 1;
      state.globalLoading = true;
    },
    stopGlobalLoading: (state) => {
      state.pendingRequests = Math.max(0, state.pendingRequests - 1);
      state.globalLoading = state.pendingRequests > 0;
    },
  },
});

export const { startGlobalLoading, stopGlobalLoading } = uiSlice.actions;
export default uiSlice.reducer;
