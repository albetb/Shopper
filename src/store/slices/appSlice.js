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
      const { links: raw, bonus = 0 } = action.payload;
      const links = Array.isArray(raw) ? raw : [raw];

      state.infoCards = state.infoCards.filter(c => c.Link !== links[0]);

      let cards = getSpellByLink(links[0]);

      if (cards.length) {
        state.infoCards.unshift(...cards);
        if (isMobile()) state.infoSidebarCollapsed = false;
        return;
      }

      cards = getItemByLink(links[0], bonus);

      console.log(links[0]);
      links.slice(1).forEach(link => {
        const effect = getEffectByLink(link);
        
        if (effect)
          console.log(effect);
          console.log(cards[0]);
          cards[0].Description = cards[0].Description + "<p><b>" + effect.Name + "</b></p>" + effect.Description;
          cards[0].Name = composeNameWithEffect(cards[0].Name, effect.Name);
      });

      if (cards.length) {
        state.infoCards.unshift(...cards);
        if (isMobile()) state.infoSidebarCollapsed = false;
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

function composeNameWithEffect(name, effect) {
  const suffixMatch = name.match(/(,perfect|\+[1-5])$/);
  const suffix = suffixMatch ? suffixMatch[1] : '';
  
  const base = suffixMatch
    ? name.slice(0, suffixMatch.index)
    : name;
  
  const trimmedBase   = base.trim();
  const trimmedEffect = effect.trim();
  const joined        = trimmedBase
    ? `${trimmedBase}, ${trimmedEffect}`
    : trimmedEffect;
  const space = suffix.includes("+") ? " " : "";

  return `${joined}${space}${suffix}`;
}

export const {
  toggleSidebar,
  toggleInfoSidebar,
  addCardByLink,
  removeCard,
  clearInfoCards
} = appSlice.actions;

export default appSlice.reducer;
