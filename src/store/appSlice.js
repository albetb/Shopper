import { createSlice } from '@reduxjs/toolkit';
import * as db from '../lib/storage';
import { cap } from '../lib/utils';
import World from '../lib/world';
import City from '../lib/city';
import Shop from '../lib/shop';

const initialState = {
  sidebarCollapsed: false,
  worlds: [],            // array of { Id, Name }
  selectedWorld: null,   // { Id, Name }
  world: null,           // full serialized world
  city: null,            // full serialized city
  shop: null,            // full serialized shop
  shopGenerated: false,
};

const serialize = obj => obj && typeof obj.serialize === 'function'
  ? obj.serialize()
  : obj;

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    // Initial load
    setWorlds(state, action) {
      state.worlds = action.payload;
    },
    setSelectedWorld(state, action) {
      state.selectedWorld = action.payload;
    },
    setWorld(state, action) {
      state.world = action.payload;
    },
    setCity(state, action) {
      state.city = action.payload;
    },
    setShop(state, action) {
      state.shop = action.payload;
    },

    // Shop-generation flag
    setShopGenerated(state, action) {
      state.shopGenerated = action.payload;
    },

    // === YOUR CALLBACKS AS REDUCERS ===

    onNewWorld(state, action) {
      const name = cap(action.payload);
      if (!name || state.worlds.some(w => w.Name === name)) return;

      // create & persist
      const w = new World(name);
      db.setWorld(w);
      state.world = serialize(w);

      // update worlds list
      const entry = { Id: w.Id, Name: w.Name };
      state.worlds.push(entry);
      db.setWorlds(state.worlds);

      // select it
      state.selectedWorld = entry;
      db.setSelectedWorld(entry);

      // reset city/shop
      state.city = null;
      state.shop = null;

      // compute shopGenerated
      const dbW = db.getWorld(w.Id);
      state.shopGenerated = dbW.Cities.some(c => 
        db.getCity(c.Id).Shops.some(s => (db.getShop(s.Id).getInventory()||[]).length>0)
      );
    },

    onNewCity(state, action) {
      const name = cap(action.payload);
      if (!state.world || state.world.Cities.some(c => c.Name === name)) return;

      // create & persist
      const c = new City(name, state.world.Level);
      db.setCity(c);

      // update world model
      const w = new World().load(state.world);
      w.addCity(c.Id, c.Name);
      db.setWorld(w);
      state.world = serialize(w);

      state.city = serialize(c);
      state.shop = null;
    },

    onNewShop(state, action) {
      const name = cap(action.payload);
      if (!state.city || state.city.Shops.some(s => s.Name === name)) return;

      // create & persist
      const s = new Shop(name, state.city.Level, state.world.Level);
      db.setShop(s);

      // update city model
      const c = new City().load(state.city);
      c.addShop(s.Id, s.Name);
      db.setCity(c);

      state.city = serialize(c);
      state.shop = s;
    },

    onSelectWorld(state, action) {
      const name = action.payload;
      const entry = state.worlds.find(w => w.Name === name);
      if (!entry) return;

      db.setSelectedWorld(entry);
      state.selectedWorld = entry;

      const w = db.getWorld(entry.Id);
      state.world = serialize(w);

      const cDb = db.getCity(w.SelectedCity.Id);
      state.city = serialize(cDb);
      state.shop = serialize(db.getShop(cDb.SelectedShop.Id));

      // recompute flag
      state.shopGenerated = w.Cities.some(c =>
        db.getCity(c.Id).Shops.some(s =>
          (db.getShop(s.Id).getInventory()||[]).length>0
        )
      );
    },

    onSelectCity(state, action) {
      const name = action.payload;
      if (!state.world) return;

      const cityMeta = state.world.Cities.find(c => c.Name === name);
      if (!cityMeta) return;

      // update world
      const w = new World().load(state.world);
      w.selectCity(cityMeta.Id);
      db.setWorld(w);
      state.world = serialize(w);

      // update selected city/shop
      const c = db.getCity(cityMeta.Id);
      state.city = serialize(c);
      state.shop = serialize(db.getShop(c.SelectedShop.Id));
    },

    onSelectShop(state, action) {
      const name = action.payload;
      if (!state.city) return;

      const shopMeta = state.city.Shops.find(s => s.Name === name);
      if (!shopMeta) return;

      const c = new City().load(state.city);
      c.selectShop(shopMeta.Id);
      db.setCity(c);
      state.city = serialize(c);

      state.shop = serialize(db.getShop(shopMeta.Id));
    },

    onPlayerLevelChange(state, action) {
      const level = action.payload;
      if (!state.world) return;

      const w = new World().load(state.world);
      w.setPlayerLevel(level);
      db.setWorld(w);
      state.world = serialize(w);

      const c = db.getCity(w.SelectedCity.Id);
      state.city = serialize(c);
      state.shop = c?.SelectedShop != null ? serialize(db.getShop(c.SelectedShop.Id)) : null;
    },

    onCityLevelChange(state, action) {
      const level = action.payload;
      if (!state.city) return;

      const c = new City().load(state.city);
      c.setCityLevel(level);
      db.setCity(c);
      state.city = serialize(c);

      state.shop = serialize(db.getShop(c.SelectedShop.Id));
    },

    onDeleteWorld(state) {
      if (!state.selectedWorld) return;
      const old = state.selectedWorld;

      // remove all child data
      const oldDb = db.getWorld(old.Id);
      oldDb.Cities.forEach(c => {
        db.getCity(c.Id).Shops.forEach(s => db.deleteShop(s.Id));
        db.deleteCity(c.Id);
      });
      db.deleteWorld(old.Id);

      // update worlds array & select new
      state.worlds = state.worlds.filter(w => w.Id !== old.Id);
      const next = state.worlds[0] || null;
      state.selectedWorld = next;
      db.setSelectedWorld(next);
      db.setWorlds(state.worlds);

      if (next) {
        const w = db.getWorld(next.Id);
        state.world = serialize(w);
        const c = db.getCity(w.SelectedCity.Id);
        state.city = serialize(c);
        state.shop = serialize(db.getShop(c.SelectedShop.Id));
      } else {
        state.world = state.city = state.shop = null;
      }
    },

    onDeleteCity(state) {
      if (!state.world || !state.city) return;
      const old = state.city;

      // delete shops + city
      const oldDb = db.getCity(old.Id);
      oldDb.Shops.forEach(s => db.deleteShop(s.Id));
      db.deleteCity(old.Id);

      // update world model
      const w = new World().load(state.world);
      const nextCityMeta = w.Cities.find(c => c.Id !== old.Id);
      w.selectCity(nextCityMeta?.Id);
      w.deleteCity(old.Id);
      db.setWorld(w);
      state.world = serialize(w);

      // update selection
      if (nextCityMeta) {
        const c = db.getCity(nextCityMeta.Id);
        state.city = serialize(c);
        state.shop = serialize(db.getShop(c.SelectedShop.Id));
      } else {
        state.city = state.shop = null;
      }
    },

    onDeleteShop(state) {
      if (!state.city || !state.shop) return;
      const old = state.shop;

      // delete shop in DB
      db.deleteShop(old.Id);

      // update city model
      const c = new City().load(state.city);
      const nextMeta = c.Shops.find(s => s.Id !== old.Id);
      c.selectShop(nextMeta?.Id);
      c.deleteShop(old.Id);
      db.setCity(c);
      state.city = serialize(c);

      state.shop = nextMeta
        ? serialize(db.getShop(nextMeta.Id))
        : null;

      // recompute flag
      const w = db.getWorld(state.selectedWorld.Id);
      state.shopGenerated = w.Cities.some(c2 =>
        db.getCity(c2.Id).Shops.some(s2 =>
          (db.getShop(s2.Id).getInventory()||[]).length>0
        )
      );
    },

    updateShop(state, action) {
      const [method, ...args] = action.payload;
      if (!state.shop) return;
      const s = new Shop().load(state.shop);
      s[method](...args);
      db.setShop(s);
      state.shop = serialize(s);
    },

    onCreateShop(state) {
      if (!state.shop) return;
      const s = new Shop().load(state.shop);
      s.template();
      s.generateInventory();
      db.setShop(s);
      state.shop = serialize(s);

      // recompute flag
      const w = db.getWorld(state.selectedWorld.Id);
      state.shopGenerated = w.Cities.some(c =>
        db.getCity(c.Id).Shops.some(s2 =>
          (db.getShop(s2.Id).getInventory()||[]).length>0
        )
      );
    },

    onWaitTime(state, action) {
      const [days, hours] = action.payload;
      const w = db.getWorld(state.selectedWorld.Id);
      w.Cities.forEach(cMeta => {
        const c = db.getCity(cMeta.Id);
        c.Shops.forEach(sMeta => {
          const s = db.getShop(sMeta.Id);
          s.passingTime(days, hours);
          db.setShop(s);
          if (s.Id === state.shop?.Id) {
            state.shop = serialize(s);
          }
        });
      });
    },
  },
});

export const {
  toggleSidebar,
  setWorlds,
  setSelectedWorld,
  setWorld,
  setCity,
  setShop,
  setShopGenerated,

  onNewWorld,
  onNewCity,
  onNewShop,
  onSelectWorld,
  onSelectCity,
  onSelectShop,
  onPlayerLevelChange,
  onCityLevelChange,
  onDeleteWorld,
  onDeleteCity,
  onDeleteShop,
  updateShop,
  onCreateShop,
  onWaitTime,
} = appSlice.actions;

export default appSlice.reducer;
