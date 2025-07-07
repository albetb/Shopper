import { createSlice } from '@reduxjs/toolkit';
import { serialize } from '../../lib/utils';
import * as db from '../../lib/storage';

const initialState = {
  city: null,
};

export const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    setCity: {
      reducer(state, action) {
        db.setCity(action.payload);
        state.city = action.payload;
      },
      prepare(cityInstance) {
        return { payload: serialize(cityInstance) };
      }
    }
  },
});

export const { setCity } = citySlice.actions;
export default citySlice.reducer;
