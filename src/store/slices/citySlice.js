import { createSlice } from '@reduxjs/toolkit';
import { serialize } from '../../lib/utils';

const initialState = {
  city: null,  // full serialized city
};

export const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    setCity: {
      reducer(state, action) {
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
