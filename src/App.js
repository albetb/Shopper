import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/sidebar';
import ShopInventory from './components/shop_inventory/shop_inventory';
import Shop from './lib/shop';
import { cap, shopTypes, isMobile, order } from './lib/utils';
import * as db from './lib/storage';
import './style/App.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [worlds, setWorlds] = useState([]);
  const [cities, setCities] = useState([]);
  const [shops, setShops] = useState([]);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [cityLevel, setCityLevel] = useState(1);
  const [shop, setShop] = useState(null);

  useEffect(() => {
    setWorldFromStorage();
  }, []);

  useEffect(() => {
    if (worlds.length > 0)
      setCityFromStorage();
  }, [worlds]);

  useEffect(() => {
    if (cities.length > 0)
      setShopFromStorage();
  }, [cities]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  //#region setFromStorage

  const setWorldFromStorage = () => {
    const dbWorlds = db.getWorlds();
    setWorlds(dbWorlds);
    if (dbWorlds.length > 0) {
      setPlayerLevel(db.getPlayerLevel(dbWorlds[0]));
    }
  }

  const setCityFromStorage = () => {
    const dbCities = db.getCities(worlds[0]);
    setCities(dbCities);
    if (dbCities.length > 0) {
      setCityLevel(db.getCityLevel(worlds[0], dbCities[0]));
    }
  }

  const setShopFromStorage = () => {
    const dbShops = db.getShops(worlds[0], cities[0]);
    setShops(dbShops);
    if (dbShops.length > 0) {
      setShop(db.getShop(worlds[0], cities[0], dbShops[0]));
    }
  }

  //#endregion

  //#region onNew

  const onNewWorld = (name) => {
    if (name.trim() !== '' && !worlds.includes(cap(name))) {
      const newWorlds = order(worlds, cap(name));
      setWorlds(newWorlds);
      db.setWorlds(newWorlds);
      onPlayerLevelChange(1, newWorlds[0]);

      setCities([]);
      setShops([]);
      setShop(null);
    }
  };

  const onNewCity = (name) => {
    if (name.trim() !== '' && !cities.includes(cap(name))) {
      const newCities = order(cities, cap(name));
      setCities(newCities);
      db.setCities(worlds[0], newCities);
      onCityLevelChange(1, newCities[0]);

      setShops([]);
      setShop(null);
    }
  };

  const onNewShop = (name) => {
    if (name.trim() !== '' && !shops.includes(cap(name))) {
      const newShops = order(shops, cap(name));
      setShops(newShops);
      db.setShops(worlds[0], cities[0], newShops);

      const newShop = new Shop(cap(name), cityLevel, playerLevel);
      db.setShop(worlds[0], cities[0], cap(name), newShop);
      setShop(newShop);
    }
  };

  //#endregion

  //#region onSelect

  const onSelectWorld = (world) => {
    db.setWorlds(order(worlds, world));
    setWorldFromStorage();
  };

  const onSelectCity = (city) => {
    db.setCities(worlds[0], order(cities, city));
    setCityFromStorage();
  };

  const onSelectShop = (shop) => {
    db.setShops(worlds[0], cities[0], order(shops, shop));
    setShopFromStorage();
  };

  //#endregion

  //#region onChange

  const onPlayerLevelChange = (level, newWorld) => {
    if (level && parseInt(level) > 0 && parseInt(level) < 100) {
      setPlayerLevel(parseInt(level));
      db.setPlayerLevel(newWorld ?? worlds[0], parseInt(level));

      db.getCities(newWorld ?? worlds[0]).forEach(cityName => {
        db.getShops(newWorld ?? worlds[0], cityName).forEach(shopName => {
          var updatedShop = new Shop();
          updatedShop.deserialize(db.getShop(newWorld ?? worlds[0], cityName, shopName));
          updatedShop.setPlayerLevel(parseInt(level));
          db.setShop(newWorld ?? worlds[0], cityName, shopName, updatedShop);
          if (shop.Name === shopName && cityName === cities[0]) {
            setShop(updatedShop);
          }
        });
      });
    }
  };

  const onCityLevelChange = (level, newCity) => {
    if (level && parseInt(level) > 0 && parseInt(level) < 6) {
      setCityLevel(parseInt(level));
      db.setCityLevel(worlds[0], newCity ?? cities[0], parseInt(level));

      db.getShops(worlds[0], newCity ?? cities[0]).forEach(shopName => {
        var updatedShop = new Shop();
        updatedShop.deserialize(db.getShop(worlds[0], newCity ?? cities[0], shopName));
        updatedShop.setCityLevel(parseInt(level));
        db.setShop(worlds[0], newCity ?? cities[0], shopName, updatedShop);
        if (shop.Name === shopName) {
          setShop(updatedShop);
        }
      });
    }
  };

  //#endregion

  //#region shop

  const updateShop = (method, ...args) => {
    if (shop) {
      var updatedShop = new Shop();
      updatedShop.deserialize(shop);
      updatedShop[method].apply(updatedShop, args);
      setShop(updatedShop);
      db.setShop(worlds[0], cities[0], shops[0], updatedShop);
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

  const onCreateShop = () => {
    if (shop) {
      var updatedShop = new Shop();
      updatedShop.deserialize(shop);
      updatedShop.template();
      updatedShop.generateInventory();
      setShop(updatedShop);
      db.setShop(worlds[0], cities[0], shops[0], updatedShop);

      if (isMobile())
        setSidebarCollapsed(true)
    }
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
    savedWorlds: worlds ?? [],
    playerLevel: playerLevel,
    onNewWorld: onNewWorld,
    onSelectWorld: onSelectWorld,
    onPlayerLevelChange: onPlayerLevelChange,
    savedCities: cities ?? [],
    cityLevel: cityLevel,
    onNewCity: onNewCity,
    onSelectCity: onSelectCity,
    onCityLevelChange: onCityLevelChange,
    savedShops: shops ?? [],
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
        <ShopInventory items={shop?.getInventory() ?? []} shopName={shops[0]} cityName={cities[0]} onDeleteItem={onDeleteItem} onAddItem={onAddItem} />
      </header>
    </body>
  );
}

export default App;
