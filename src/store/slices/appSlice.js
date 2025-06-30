import { createSlice } from '@reduxjs/toolkit';
import { getSpellByLink, getItemByLink, isMobile } from '../../lib/utils';

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
      const card = state.infoCards.find(card => card.Link === link);
      if (card) {
        state.infoCards = state.infoCards.filter(c => c.Link !== link);
        state.infoCards.unshift(card);
      } else {
        let cards = getSpellByLink(link);
        if (!cards.length) {
          cards = getItemByLink(link);
        }
        if (cards.length) {
          state.infoCards.unshift(...cards);
        }
        if (isMobile()) {
          state.infoSidebarCollapsed = false;
        }
      }
    },

    removeCard(state, action) {
      const card = action.payload;
      state.infoCards = state.infoCards.filter(c => c.Link !== card.Link && c.Name !== card.Name);
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
  removeCard,
  clearInfoCards
} = appSlice.actions;

export default appSlice.reducer;
