import { createSlice } from '@reduxjs/toolkit';
import * as db from '../../lib/storage';
import { serialize } from '../../lib/utils';

const initialState = {
  worlds: [],            // array of { Id, Name }
  selectedWorld: null,   // { Id, Name }
  world: null,
};

export const worldSlice = createSlice({
  name: 'world',
  initialState,
  reducers: {

    setWorlds(state, action) {
      db.setWorlds(action.payload);
      state.worlds = action.payload;
    },
    setSelectedWorld(state, action) {
      db.setSelectedWorld(action.payload);
      state.selectedWorld = action.payload;
    },
    setWorld: {
      reducer(state, action) {
        db.setWorld(action.payload);
        state.world = action.payload;
      },
      prepare(worldInstance) {
        return { payload: serialize(worldInstance) };
      }
    }
  },
});

export const {
  setWorlds,
  setSelectedWorld,
  setWorld
} = worldSlice.actions;

export default worldSlice.reducer;
