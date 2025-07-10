import City from '../../lib/city';
import * as db from '../../lib/storage';
import { cap } from '../../lib/utils';
import World from '../../lib/world';
import { setCity } from '../slices/citySlice';
import { setShop } from '../slices/shopSlice';
import { setWorld } from '../slices/worldSlice';

export const onNewCity = (nameRaw) => (dispatch, getState) => {
  const state = getState();
  const name = cap(nameRaw);
  const { world } = state.world;

  if (!world || name.trim().length === 0) return;
  if (world.Cities.some(w => w.Name === name)) { // If name already present select that item
    const found = world.Cities.find(w => w.Name === name)
    const w = new World().load(world);
    w.selectCity(found.Id);

    const c = db.getCity(found.Id);
    dispatch(setCity(c));
    dispatch(setWorld(w));
    return;
  };

  const c = new City(name, world.Level);

  const w = new World().load(world);
  w.addCity(c.Id, c.Name);

  dispatch(setWorld(w));
  dispatch(setCity(c));
  dispatch(setShop(null));
};

export const onSelectCity = (name) => (dispatch, getState) => {
  const { world } = getState().world;
  if (!world) return;

  const cityMeta = world.Cities.find(c => c.Name === name);
  if (!cityMeta) return;

  const w = new World().load(world);
  w.selectCity(cityMeta.Id);

  const c = db.getCity(cityMeta.Id);
  const shop = db.getShop(c.SelectedShop.Id);

  dispatch(setWorld(w));
  dispatch(setCity(c));
  dispatch(setShop(shop));
};

export const onCityLevelChange = (level) => (dispatch, getState) => {
  const { city } = getState().city;
  if (!city) return;

  const c = new City().load(city);
  c.setCityLevel(level);

  const shop = db.getShop(c.SelectedShop.Id);
  dispatch(setCity(c));
  dispatch(setShop(shop));
};

export const onDeleteCity = () => (dispatch, getState) => {
  const { world } = getState().world;
  const { city } = getState().city;
  if (!world || !city) return;

  const oldDb = db.getCity(city.Id);
  oldDb.Shops.forEach(s => db.deleteShop(s.Id));
  db.deleteCity(city.Id);

  const w = new World().load(world);
  const nextCityMeta = w.Cities.find(c => c.Id !== city.Id);
  w.selectCity(nextCityMeta?.Id);
  w.deleteCity(city.Id);

  dispatch(setWorld(w));

  if (nextCityMeta) {
    const c = db.getCity(nextCityMeta.Id);
    const shop = db.getShop(c.SelectedShop.Id);
    dispatch(setCity(c));
    dispatch(setShop(shop));
  } else {
    dispatch(setCity(null));
    dispatch(setShop(null));
  }
};
