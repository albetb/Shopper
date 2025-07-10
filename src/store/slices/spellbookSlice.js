import { createSlice } from '@reduxjs/toolkit';
import { serialize } from '../../lib/utils';
import * as db from '../../lib/storage';

const initialState = {
  spellbooks: [],
  selectedSpellbook: null,
  spellbook: null,
  isEditingSpellbook: true,
  isSpellbookSidebarCollapsed: false,
  isSpellTableCollapsed: [false, false, false, false, false, false, false, false, false, false],
  isClassDescriptionCollapsed: false,
  searchSpellName: false,
  searchSpellSchool: false,
};

export const spellbookSlice = createSlice({
  name: 'spellbook',
  initialState,
  reducers: {
    setSpellbooks(state, action) {
      db.setSpellbooks(action.payload);
      state.spellbooks = action.payload;
    },
    setSelectedSpellbook(state, action) {
      db.setSelectedSpellbook(action.payload);
      state.selectedSpellbook = action.payload;
    },
    setSpellbook: {
      reducer(state, action) {
        db.setSpellbook(action.payload);
        state.spellbook = action.payload;
      },
      prepare(spellbookInstance) {
        return { payload: serialize(spellbookInstance) };
      }
    },
    setIsEditingSpellbook(state, action) {
      db.setIsEditingSpellbook(action.payload);
      state.isEditingSpellbook = action.payload;
    },
    setIsSpellTableCollapsed(state, action) {
      db.setIsSpellTableCollapsed(action.payload);
      state.isSpellTableCollapsed = action.payload;
    },
    setIsSpellbookSidebarCollapsed(state, action) {
      db.setIsSpellbookSidebarCollapsed(action.payload);
      state.isSpellbookSidebarCollapsed = action.payload;
    },
    setIsClassDescriptionCollapsed(state, action) {
      db.setIsClassDescriptionCollapsed(action.payload);
      state.isClassDescriptionCollapsed = action.payload;
    },
    setSearchSpellName(state, action) {
      db.setSearchSpellName(action.payload);
      state.searchSpellName = action.payload;
    },
    setSearchSpellSchool(state, action) {
      db.setSearchSpellSchool(action.payload);
      state.searchSpellSchool = action.payload;
    }
  }
});

export const {
  setSpellbooks,
  setSelectedSpellbook,
  setSpellbook,
  setIsEditingSpellbook,
  setIsSpellTableCollapsed,
  setIsSpellbookSidebarCollapsed,
  setIsClassDescriptionCollapsed,
  setSearchSpellName,
  setSearchSpellSchool
} = spellbookSlice.actions;

export default spellbookSlice.reducer;