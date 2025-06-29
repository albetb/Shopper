import { createSlice } from '@reduxjs/toolkit';
import { getSpellByLink } from '../../lib/utils';

const initialState = {
  sidebarCollapsed: false,
  infoSidebarCollapsed: false,
  infoCards: []
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    toggleInfoSidebar(state) {
      state.infoSidebarCollapsed = !state.infoSidebarCollapsed;
    },

    addCardByLink(state, action) {
      const link = action.payload;
      const existingLinks = state.infoCards.map(card => card.Link);
      if (!existingLinks.includes(link)) {
        const cards = getSpellByLink(link);
        if (cards.length) {
          state.infoCards.push(...cards);
        }
      }
    },

    clearInfoCards(state) {
      state.infoCards = [];
    }
  }
});

export const {
  toggleSidebar,
  toggleInfoSidebar,
  addCardByLink,
  clearInfoCards
} = appSlice.actions;

export default appSlice.reducer;
