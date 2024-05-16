import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/sidebar';
import ShopInventory from './components/shop_inventory/shop_inventory';
import World from './lib/world';
import City from './lib/city';
import Shop from './lib/shop';
import { cap, shopTypes, isMobile, order } from './lib/utils';
import * as db from './lib/storage';
import './style/App.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [worlds, setWorlds] = useState([]);
  const [selectedWorld, setSelectedWorld] = useState('');
  const [world, setWorld] = useState(null);
  const [city, setCity] = useState(null);
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const worldsDb = db.getWorlds();
    const selectedWorldDb = db.getSelectedWorld();
    const worldDb = db.getWorld(selectedWorldDb?.Id);
    const cityDb = db.getCity(worldDb?.SelectedCity?.Id);
    const shopDb = db.getShop(cityDb?.SelectedShop.Id);
    setWorlds(worldsDb);
    setSelectedWorld(selectedWorldDb);
    setWorld(worldDb);
    setCity(cityDb);
    setShop(shopDb);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  //#region onNew

  const onNewWorld = (name) => {
    if (name.trim() !== '' && !worlds.some(world => world.Name === cap(name))) {
      const newWorld = new World(cap(name));
      setWorld(newWorld);
      db.setWorld(newWorld);

      const newWorlds = [...worlds, { Id: newWorld.Id, Name: newWorld.Name }];
      setWorlds(newWorlds);
      db.setWorlds(newWorlds);

      setSelectedWorld({ Id: newWorld.Id, Name: newWorld.Name });
      db.setSelectedWorld({ Id: newWorld.Id, Name: newWorld.Name });

      setCity(null);
      setShop(null);
    }
  };

  const onNewCity = (name) => {
    if (name.trim() !== '' && !world.cityNameExist(cap(name))) {
      const newCity = new City(cap(name), world.Level);
      setCity(newCity);
      db.setCity(newCity);

      let newWorld = new World().load(world);
      newWorld.addCity(newCity.Id, newCity.Name);
      setWorld(newWorld);
      db.setWorld(newWorld);

      setShop(null);
    }
  };

  const onNewShop = (name) => {
    if (name.trim() !== '' && !city.shopNameExist(cap(name))) {
      const newShop = new Shop(cap(name), city.Level, world.Level);
      setShop(newShop);
      db.setShop(newShop);

      let newCity = new City().load(city);
      newCity.addShop(newShop.Id, newShop.Name);
      setCity(newCity);
      db.setCity(newCity);
    }
  };

  //#endregion

  //#region onSelect

  const onSelectWorld = (name) => {
    const newSelectedWorld = worlds.find(world => world.Name === name);
    if (!newSelectedWorld) { return; }

    setSelectedWorld({ Id: newSelectedWorld.Id, Name: newSelectedWorld.Name });
    db.setSelectedWorld({ Id: newSelectedWorld.Id, Name: newSelectedWorld.Name });

    const newWorld = db.getWorld(newSelectedWorld.Id);
    setWorld(newWorld);

    const newCity = db.getCity(newWorld.SelectedCity.Id);
    setCity(newCity);

    setShop(db.getShop(newCity?.SelectedShop?.Id));
  };

  const onSelectCity = (name) => {
    const newSelectedCity = world.Cities.find(city => city.Name === name);
    if (!newSelectedCity) { return; }

    let newWorld = new World().load(world);
    newWorld.selectCity(newSelectedCity.Id)
    setWorld(newWorld);
    db.setWorld(newWorld);

    const newCity = db.getCity(newSelectedCity.Id);
    setCity(newCity);

    setShop(db.getShop(newCity.SelectedShop.Id));
  };

  const onSelectShop = (name) => {
    const newSelectedShop = city.Shops.find(shop => shop.Name === name);
    if (!newSelectedShop) { return; }

    let newCity = new City().load(city);
    newCity.selectShop(newSelectedShop.Id)
    setCity(newCity);
    db.setCity(newCity);

    setShop(db.getShop(newSelectedShop.Id));
  };

  //#endregion

  //#region onChange

  const onPlayerLevelChange = (level) => {
    let newWorld = new World().load(world);
    newWorld.setPlayerLevel(level);
    setWorld(newWorld);
    db.setWorld(newWorld);

    const newCity = db.getCity(newWorld.SelectedCity.Id);
    setCity(newCity);

    setShop(db.getShop(newCity?.SelectedShop?.Id));
  };

  const onCityLevelChange = (level) => {
    let newCity = new City().load(city);
    newCity.setCityLevel(level);
    setCity(newCity);
    db.setCity(newCity);

    setShop(db.getShop(newCity.SelectedShop.Id));
  };

  //#endregion

  //#region shop

  const updateShop = (method, ...args) => {
    if (shop) {
      var updatedShop = new Shop().load(shop);
      updatedShop[method].apply(updatedShop, args);
      setShop(updatedShop);
      db.setShop(updatedShop);
    }
  };

  const onCreateShop = () => {
    if (shop) {
      var updatedShop = new Shop().load(shop);
      updatedShop.template();
      updatedShop.generateInventory();
      setShop(updatedShop);
      db.setShop(updatedShop);

      if (isMobile())
        setSidebarCollapsed(true)
    }
  };

  const onShopLevelChange = (level) => {
    updateShop('setShopLevel', level);
  };

  const onReputationChange = (level) => {
    updateShop('setReputation', level);
  };

  const onShopTypeChange = (type) => {
    updateShop('setShopType', type);
  };

  const onDeleteItem = (itemName, itemType) => {
    updateShop('sell', itemName, itemType);
  };

  const onAddItem = (itemName, itemType, cost, number) => {
    updateShop('buy', itemName, itemType, cost, number);
  };

  //#endregion

  var sidebarProps = {
    isSidebarCollapsed: sidebarCollapsed,
    toggleSidebar: toggleSidebar,
    savedWorlds: order(worlds?.map(world => world.Name), selectedWorld.Name),
    playerLevel: world?.Level ?? 0,
    onNewWorld: onNewWorld,
    onSelectWorld: onSelectWorld,
    onPlayerLevelChange: onPlayerLevelChange,
    savedCities: order(world?.Cities?.map(city => city.Name), world?.SelectedCity?.Name),
    cityLevel: city?.Level ?? 0,
    onNewCity: onNewCity,
    onSelectCity: onSelectCity,
    onCityLevelChange: onCityLevelChange,
    savedShops: order(city?.Shops?.map(shop => shop.Name), city?.SelectedShop?.Name),
    shopLevel: shop?.Level ?? 0,
    reputation: shop?.Reputation ?? 0,
    onNewShop: onNewShop,
    onSelectShop: onSelectShop,
    onShopLevelChange: onShopLevelChange,
    onReputationChange: onReputationChange,
    shopTypes: shopTypes() ?? [],
    shopType: shop?.ShopType ?? '',
    onShopTypeChange: onShopTypeChange,
    onCreateShop: onCreateShop
  };

  return (
    <body className='app'>
      <Sidebar props={sidebarProps} />
      <header className='app-header'>
        <ShopInventory items={shop?.getInventory() ?? []} shopName={shop?.Name ?? ''} cityName={city?.Name ?? ''} onDeleteItem={onDeleteItem} onAddItem={onAddItem} />
      </header>
    </body>
  );
}

export default App;
