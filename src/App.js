import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './components/sidebar/sidebar';
import ShopInventory from './components/shop_inventory/shop_inventory';
import { shopTypes, order } from './lib/utils';
import * as db from './lib/storage';
import {
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
  onWaitTime
} from './store/appSlice';
import './style/App.css';

export default function App() {
  const dispatch = useDispatch();
  const {
    sidebarCollapsed,
    worlds,
    selectedWorld,
    world,
    city,
    shop,
    shopGenerated,
  } = useSelector(state => state.app);

  useEffect(() => {
    // Initialize from DB and compute shopGenerated
    db.validateDb();
    const worldsDb = db.getWorlds();
    const selW = db.getSelectedWorld();
    const w = db.getWorld(selW?.Id);
    const c = db.getCity(w?.SelectedCity?.Id);
    const s = db.getShop(c?.SelectedShop?.Id);

    dispatch(setWorlds(worldsDb));
    dispatch(setSelectedWorld(selW));
    dispatch(setWorld(w));
    dispatch(setCity(c));
    dispatch(setShop(s));

    const generated = w?.Cities?.some(ci =>
      db.getCity(ci.Id).Shops.some(sh =>
        (db.getShop(sh.Id).getInventory() || []).length > 0
      )
    ) ?? false;
    dispatch(setShopGenerated(generated));
  }, [dispatch]);

  const handleToggle = () => dispatch(toggleSidebar());

  const sidebarProps = {
    isSidebarCollapsed: sidebarCollapsed,
    toggleSidebar: handleToggle,
    savedWorlds: order(worlds.map(w => w.Name), selectedWorld?.Name),
    playerLevel: world?.Level ?? 1,
    onNewWorld: name => dispatch(onNewWorld(name)),
    onDeleteWorld: () => dispatch(onDeleteWorld()),
    onSelectWorld: name => dispatch(onSelectWorld(name)),
    onPlayerLevelChange: lvl => dispatch(onPlayerLevelChange(lvl)),

    savedCities: order(world?.Cities.map(c => c.Name), world?.SelectedCity?.Name),
    cityLevel: city?.Level ?? 1,
    onNewCity: name => dispatch(onNewCity(name)),
    onDeleteCity: () => dispatch(onDeleteCity()),
    onSelectCity: name => dispatch(onSelectCity(name)),
    onCityLevelChange: lvl => dispatch(onCityLevelChange(lvl)),

    savedShops: order(city?.Shops.map(s => s.Name), city?.SelectedShop?.Name),
    shopLevel: shop?.Level ?? 0,
    reputation: shop?.Reputation ?? 0,
    onNewShop: name => dispatch(onNewShop(name)),
    onDeleteShop: () => dispatch(onDeleteShop()),
    onSelectShop: name => dispatch(onSelectShop(name)),
    onShopLevelChange: lvl => dispatch(updateShop(['setShopLevel', lvl])),
    onReputationChange: lvl => dispatch(updateShop(['setReputation', lvl])),
    shopTypes: shopTypes(),
    shopType: shop?.ShopType ?? '',
    onShopTypeChange: tp => dispatch(updateShop(['setShopType', tp])),
    onCreateShop: () => dispatch(onCreateShop()),
    onWaitTime: (d, h) => dispatch(onWaitTime([d, h])),
    isShopGenerated: shopGenerated,
  };

  const shopInventoryProps = {
    items: shop?.getInventory() ?? [],
    shopName: shop?.Name ?? '',
    cityName: city?.Name ?? '',
    gold: shop?.Gold,
    onDeleteItem: (itemName, itemType, num) => dispatch(updateShop(['sell', itemName, itemType, num])),
    onAddItem: (itemName, itemType, cost, number) => dispatch(updateShop(['buy', itemName, itemType, cost, number])),
  };

  return (
    <div className="app">
      <Sidebar props={sidebarProps} />
      <header className="app-header">
        <ShopInventory props={shopInventoryProps} />
      </header>
    </div>
  );
}
