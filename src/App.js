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

  //#region save

  const saveWorlds = (item) => {
    setWorlds(item);
    db.setWorlds(item);
  }

  const saveSelectedWorld = (item) => {
    setSelectedWorld(item);
    db.setSelectedWorld(item);
  }

  const saveWorld = (item) => {
    setWorld(item);
    db.setWorld(item);
  }

  const saveCity = (item) => {
    setCity(item);
    db.setCity(item);
  }

  const saveShop = (item) => {
    setShop(item);
    db.setShop(item);
  }

  //#endregion

  //#region onNew

  const onNewWorld = (name) => {
    if (name.trim() !== '' && !worlds.some(world => world.Name === cap(name))) {
      const newWorld = new World(cap(name));
      saveWorld(newWorld);

      const newWorlds = [...worlds, { Id: newWorld.Id, Name: newWorld.Name }];
      saveWorlds(newWorlds);

      saveSelectedWorld({ Id: newWorld.Id, Name: newWorld.Name });

      setCity(null);
      setShop(null);
    }
  };

  const onNewCity = (name) => {
    if (name.trim() !== '' && !world.cityNameExist(cap(name))) {
      const newCity = new City(cap(name), world.Level);
      saveCity(newCity);

      let newWorld = new World().load(world);
      newWorld.addCity(newCity.Id, newCity.Name);
      saveWorld(newWorld);

      setShop(null);
    }
  };

  const onNewShop = (name) => {
    if (name.trim() !== '' && !city.shopNameExist(cap(name))) {
      const newShop = new Shop(cap(name), city.Level, world.Level);
      saveShop(newShop);

      let newCity = new City().load(city);
      newCity.addShop(newShop.Id, newShop.Name);
      saveCity(newCity);
    }
  };

  //#endregion

  //#region onSelect

  const onSelectWorld = (name) => {
    const newSelectedWorld = worlds.find(world => world.Name === name);
    if (!newSelectedWorld) { return; }

    saveSelectedWorld({ Id: newSelectedWorld.Id, Name: newSelectedWorld.Name });

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
    saveWorld(newWorld);

    const newCity = db.getCity(newSelectedCity.Id);
    setCity(newCity);

    setShop(db.getShop(newCity.SelectedShop.Id));
  };

  const onSelectShop = (name) => {
    const newSelectedShop = city.Shops.find(shop => shop.Name === name);
    if (!newSelectedShop) { return; }

    let newCity = new City().load(city);
    newCity.selectShop(newSelectedShop.Id)
    saveCity(newCity);

    setShop(db.getShop(newSelectedShop.Id));
  };

  //#endregion

  //#region onChange

  const onPlayerLevelChange = (level) => {
    let newWorld = new World().load(world);
    newWorld.setPlayerLevel(level);
    saveWorld(newWorld);

    const newCity = db.getCity(newWorld.SelectedCity.Id);
    setCity(newCity);

    setShop(db.getShop(newCity?.SelectedShop?.Id));
  };

  const onCityLevelChange = (level) => {
    let newCity = new City().load(city);
    newCity.setCityLevel(level);
    saveCity(newCity);

    setShop(db.getShop(newCity.SelectedShop.Id));
  };

  //#endregion

  //#region onDelete

  const onDeleteWorld = () => {
    const oldSelectedWorld = selectedWorld;
    const newSelectedWorld = worlds.filter(s => s.Id !== oldSelectedWorld.Id)?.[0];

    const oldSelectedWorldDb = db.getWorld(oldSelectedWorld.Id);
    oldSelectedWorldDb.Cities.forEach(city => {
      const cityDb = db.getCity(city.Id);
      cityDb.Shops.forEach(shop => {
        db.deleteShop(shop.Id);
      })
      db.deleteCity(city.Id);
    });

    saveSelectedWorld(newSelectedWorld);
    saveWorlds(worlds.filter(s => s.Id !== oldSelectedWorld.Id));
    const newSelectedWorldDb = db.getWorld(newSelectedWorld?.Id)
    setWorld(newSelectedWorldDb);

    const newSelectedCityDb = db.getCity(newSelectedWorldDb?.SelectedCity?.Id)
    setShop(db.getShop(newSelectedCityDb?.SelectedShop?.Id));
    setCity(newSelectedCityDb);
    db.deleteWorld(oldSelectedWorld.Id)
  };

  const onDeleteCity = () => {
    let newWorld = new World().load(world);
    const oldSelectedCity = world.SelectedCity;
    const newSelectedCity = world.Cities.filter(s => s.Id !== oldSelectedCity.Id)?.[0];
    newWorld.selectCity(newSelectedCity?.Id)
    newWorld.deleteCity(oldSelectedCity.Id);
    saveWorld(newWorld);

    const oldSelectedCityDb = db.getCity(oldSelectedCity.Id);
    oldSelectedCityDb.Shops.forEach(shop => {
      db.deleteShop(shop.Id);
    });

    const newSelectedCityDb = db.getCity(newWorld.SelectedCity.Id)
    setShop(db.getShop(newSelectedCityDb?.SelectedShop?.Id));
    setCity(newSelectedCityDb);
    db.deleteCity(oldSelectedCity.Id)
  };

  const onDeleteShop = () => {
    let newCity = new City().load(city);
    const oldSelectedShop = city.SelectedShop;
    const newSelectedShop = city.Shops.filter(s => s.Id !== oldSelectedShop.Id)?.[0];
    newCity.selectShop(newSelectedShop?.Id)
    newCity.deleteShop(oldSelectedShop.Id);
    saveCity(newCity);

    setShop(db.getShop(newCity.SelectedShop.Id));
    db.deleteShop(oldSelectedShop.Id)
  };

  //#endregion

  //#region shop

  const updateShop = (method, ...args) => {
    if (shop) {
      var updatedShop = new Shop().load(shop);
      updatedShop[method].apply(updatedShop, args);
      saveShop(updatedShop);
    }
  };

  const onCreateShop = () => {
    if (shop) {
      var updatedShop = new Shop().load(shop);
      updatedShop.template();
      updatedShop.generateInventory();
      saveShop(updatedShop);

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
    savedWorlds: order(worlds?.map(world => world.Name), selectedWorld?.Name),
    playerLevel: world?.Level ?? 1,
    onNewWorld: onNewWorld,
    onDeleteWorld: onDeleteWorld,
    onSelectWorld: onSelectWorld,
    onPlayerLevelChange: onPlayerLevelChange,
    savedCities: order(world?.Cities?.map(city => city.Name), world?.SelectedCity?.Name),
    cityLevel: city?.Level ?? 0,
    onNewCity: onNewCity,
    onDeleteCity: onDeleteCity,
    onSelectCity: onSelectCity,
    onCityLevelChange: onCityLevelChange,
    savedShops: order(city?.Shops?.map(shop => shop.Name), city?.SelectedShop?.Name),
    shopLevel: shop?.Level ?? 0,
    reputation: shop?.Reputation ?? 0,
    onNewShop: onNewShop,
    onDeleteShop: onDeleteShop,
    onSelectShop: onSelectShop,
    onShopLevelChange: onShopLevelChange,
    onReputationChange: onReputationChange,
    shopTypes: shopTypes() ?? [],
    shopType: shop?.ShopType ?? '',
    onShopTypeChange: onShopTypeChange,
    onCreateShop: onCreateShop
  };

  var shopInventoryProps = {
    items: shop?.getInventory() ?? [],
    shopName: shop?.Name ?? '',
    cityName: city?.Name ?? '',
    onDeleteItem: onDeleteItem,
    onAddItem: onAddItem
  }

  return (
    <body className='app'>
      <Sidebar props={sidebarProps} />
      <header className='app-header'>
        <ShopInventory props={shopInventoryProps} />
      </header>
    </body>
  );
}

export default App;
