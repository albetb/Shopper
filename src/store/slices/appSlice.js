import { createSlice } from '@reduxjs/toolkit';
import { getSpellByLink, getItemByLink, isMobile, getEffectByLink } from '../../lib/utils';

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
      const { links: rawLinks, bonus = 0 } = action.payload;

      const links = Array.isArray(rawLinks) ? rawLinks : [rawLinks];

      links.forEach(link => {
        const card = state.infoCards.find(card => card.Link === link);
        if (card) { // Always rebuild the card
          state.infoCards = state.infoCards.filter(c => c.Link !== link);
        }

        let cards = getSpellByLink(link);
        if (!cards.length) cards = getItemByLink(link);
        if (!cards.length) cards = getEffectByLink(link);

        if (cards.length && bonus === -1) { // Perfect
          if (cards[0]["Armor Check Penalty"]) {
            cards[0]["Armor Check Penalty"] = cards[0]["Armor Check Penalty"] + " (+1)";
          }

          cards[0]["Name"] = cards[0]["Name"] + ", perfect";
        }

        if (cards.length && bonus > 0) {
          if (cards[0]["Dmg (S)"] && !cards[0]["Armor/Shield Bonus"]) {
            cards[0]["Dmg (S)"] = cards[0]["Dmg (S)"] + " (+" + bonus + ")";
          }

          if (cards[0]["Dmg (M)"] && !cards[0]["Armor/Shield Bonus"]) {
            cards[0]["Dmg (M)"] = cards[0]["Dmg (M)"] + " (+" + bonus + ")";
          }

          if (cards[0]["Armor/Shield Bonus"]) {
            cards[0]["Armor/Shield Bonus"] = cards[0]["Armor/Shield Bonus"] + " (+" + bonus + ")";
          }

          if (cards[0]["Armor Check Penalty"] && parseInt(cards[0]["Armor Check Penalty"], 10) < 0) {
            cards[0]["Armor Check Penalty"] = cards[0]["Armor Check Penalty"] + " (+1)";
          }

          if (cards[0]["Dmg (S)"] || cards[0]["Dmg (M)"] || cards[0]["Armor/Shield Bonus"]) {
            cards[0]["Name"] = cards[0]["Name"] + " +" + bonus;
          }
        }

        if (cards.length) {
          state.infoCards.unshift(...cards);
        }

        if (isMobile()) {
          state.infoSidebarCollapsed = false;
        }
      });
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
