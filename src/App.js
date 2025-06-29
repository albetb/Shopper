import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Sidebar from './components/sidebar/sidebar';
import ShopInventory from './components/shop_inventory/shop_inventory';
import * as db from './lib/storage';
import {
  setWorlds,
  setSelectedWorld,
  setWorld,
  setCity,
  setShop,
  setShopGenerated
} from './store/appSlice';
import './style/App.css';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize localStorage/db
    db.validateDb();

    const worldsDb = db.getWorlds();
    const selW = db.getSelectedWorld();
    const w = db.getWorld(selW?.Id);
    const c = db.getCity(w?.SelectedCity?.Id);
    const s = db.getShop(c?.SelectedShop?.Id);

    // Populate Redux
    dispatch(setWorlds(worldsDb));
    dispatch(setSelectedWorld(selW));
    dispatch(setWorld(w));
    dispatch(setCity(c));
    dispatch(setShop(s));

    // Compute shopGenerated flag
    const generated = w?.Cities?.some(ci =>
      db.getCity(ci.Id).Shops.some(sh =>
        (db.getShop(sh.Id).getInventory() || []).length > 0
      )
    ) ?? false;
    dispatch(setShopGenerated(generated));
  }, [dispatch]);

  return (
    <div className="app">
      <Sidebar />
      <header className="app-header">
        <ShopInventory />
      </header>
    </div>
  );
}
