import { createSlice } from '@reduxjs/toolkit';
import { serialize } from '../../lib/utils';

const initialState = {
  worlds: [],            // array of { Id, Name }
  selectedWorld: null,   // { Id, Name }
  world: null,           // full serialized world
};

export const worldSlice = createSlice({
  name: 'world',
  initialState,
  reducers: {

    setWorlds(state, action) {
      state.worlds = action.payload;
    },
    setSelectedWorld(state, action) {
      state.selectedWorld = action.payload;
    },
    setWorld: {
      reducer(state, action) {
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
