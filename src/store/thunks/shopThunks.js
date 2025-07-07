import City from '../../lib/city';
import Shop from '../../lib/shop';
import * as db from '../../lib/storage';
import { cap, serialize } from '../../lib/utils';
import { setCity } from '../slices/citySlice';
import { setShop, setShopGenerated } from '../slices/shopSlice';

export const onNewShop = (nameRaw) => (dispatch, getState) => {
  const name = cap(nameRaw);
  const { city } = getState().city;
  const { world } = getState().world;

  if (!city || name.trim().length === 0) return;
  if (city.Shops.some(w => w.Name === name)) { // If name already present select that item
    const found = city.Shops.find(w => w.Name === name)
    const c = new City().load(city);
    c.selectShop(found.Id);

    const s = db.getShop(found.Id);
    dispatch(setShop(s));
    dispatch(setCity(c));
    return;
  };

  const s = new Shop(name, city.Level, world.Level);

  const c = new City().load(city);
  c.addShop(s.Id, s.Name);

  dispatch(setCity(c));
  dispatch(setShop(s));
};

export const onSelectShop = (name) => (dispatch, getState) => {
  const { city } = getState().city;
  if (!city) return;

  const shopMeta = city.Shops.find(s => s.Name === name);
  if (!shopMeta) return;

  const c = new City().load(city);
  c.selectShop(shopMeta.Id);

  dispatch(setCity(c));
  dispatch(setShop(db.getShop(shopMeta.Id)));
};

export const onDeleteShop = () => (dispatch, getState) => {
  const { city } = getState().city;
  const { shop } = getState().shop;
  const { selectedWorld } = getState().world;
  if (!city || !shop) return;

  db.deleteShop(shop.Id);

  const c = new City().load(city);
  const nextMeta = c.Shops.find(s => s.Id !== shop.Id);
  c.selectShop(nextMeta?.Id);
  c.deleteShop(shop.Id);

  dispatch(setCity(c));
  dispatch(setShop(nextMeta ? db.getShop(nextMeta.Id) : null));

  const w = db.getWorld(selectedWorld.Id);
  const hasInventory = w.Cities.some(c2 =>
    db.getCity(c2.Id).Shops.some(s2 =>
      (db.getShop(s2.Id).getInventory() || []).length > 0
    )
  );
  dispatch(setShopGenerated(serialize(hasInventory)));
};
