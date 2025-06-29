import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import cityReducer from './slices/citySlice';
import shopReducer from './slices/shopSlice';
import worldReducer from './slices/worldSlice';

const store = configureStore({
  reducer: {
    app: appReducer,
    world: worldReducer,
    city: cityReducer,
    shop: shopReducer,
  },
});

export default store;
