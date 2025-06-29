import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarCollapsed: false
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    }
  },
});

export const {
  toggleSidebar
} = appSlice.actions;

export default appSlice.reducer;
