import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ShopInventory from './components/shop_inventory/shop_inventory';
import Sidebar from './components/sidebar/sidebar';
import * as db from './lib/storage';
import { serialize } from './lib/utils';
import {
  setCity
} from './store/slices/citySlice';
import {
  setShop,
  setShopGenerated
} from './store/slices/shopSlice';
import {
  setSelectedWorld,
  setWorld,
  setWorlds
} from './store/slices/worldSlice';
import './style/App.css';
import InfoSidebar from './components/sidebar/info_sidebar';

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
    dispatch(setShopGenerated(serialize(generated)));
  }, [dispatch]);

  return (
    <div className="app">
      <Sidebar />
      <InfoSidebar />
      <header className="app-header">
        <ShopInventory />
      </header>
    </div>
  );
}
