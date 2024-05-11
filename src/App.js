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
  const [shopLevel, setShopLevel] = useState(0);
  const [reputation, setReputation] = useState(0);
  const [shopType, setShopType] = useState('');
  const [inventory, setInventory] = useState([]);

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
    if (dbWorlds.length > 0)
      setPlayerLevel(db.getPlayerLevel(dbWorlds[0]));
  }

  const setCityFromStorage = () => {
    const dbCities = db.getCities(worlds[0]);
    setCities(dbCities);
    if (dbCities.length > 0)
      setCityLevel(db.getCityLevel(worlds[0], dbCities[0]));
  }

  const setShopFromStorage = () => {
    const dbShops = db.getShops(worlds[0], cities[0]);
    setShops(dbShops);

    if (dbShops.length > 0) {
      setShopLevel(db.getShopLevel(worlds[0], cities[0], dbShops[0]));
      setReputation(db.getReputation(worlds[0], cities[0], dbShops[0]));
      setShopType(db.getShopType(worlds[0], cities[0], dbShops[0]));
      setInventory(db.getInventory(worlds[0], cities[0], dbShops[0]));
    }
  }

  //#endregion

  //#region onNew

  const onNewWorld = (name) => {
    if (name.trim() !== '' && !worlds.includes(cap(name))) {
      const worlds_ = order(worlds, cap(name));
      setWorlds(worlds_);
      db.setWorlds(worlds_);
      onPlayerLevelChange(1);

      setCities([]);
      setShops([]);
      setInventory([]);
    }
  };

  const onNewCity = (name) => {
    if (name.trim() !== '' && !cities.includes(cap(name))) {
      const cities_ = order(cities, cap(name));
      setCities(cities_);
      db.setCities(worlds[0], cities_);
      onCityLevelChange(1);

      setShops([]);
      setInventory([]);
    }
  };

  const onNewShop = (name) => {
    if (name.trim() !== '' && !shops.includes(cap(name))) {
      const shops_ = order(shops, cap(name));
      setShops(shops_);
      db.setShops(worlds[0], cities[0], shops_);
      onShopLevelChange(0);
      onReputationChange(0);
      onShopTypeChange('');
      setInventory([]);
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

  const onPlayerLevelChange = (level) => {
    if (level && parseInt(level) > 0 && parseInt(level) < 100) {
      setPlayerLevel(parseInt(level));
      db.setPlayerLevel(worlds[0], parseInt(level));
    }
  };

  const onCityLevelChange = (level) => {
    if (level && parseInt(level) > 0 && parseInt(level) < 6) {
      setCityLevel(parseInt(level));
      db.setCityLevel(worlds[0], cities[0], parseInt(level));
    }
  };

  const onShopLevelChange = (level) => {
    if ((level || parseInt(level) === 0) && parseFloat(level) > -1 && parseFloat(level) < 11) {
      setShopLevel(level);
      db.setShopLevel(worlds[0], cities[0], shops[0], level);
    }
  };

  const onReputationChange = (level) => {
    if ((level || parseInt(level) === 0) && parseFloat(level) > -11 && parseFloat(level) < 11) {
      setReputation(level);
      db.setReputation(worlds[0], cities[0], shops[0], level);
    }
  };

  const onShopTypeChange = (type) => {
    if (shopTypes().includes(type)) {
      setShopType(type);
      db.setShopType(worlds[0], cities[0], shops[0], type);
    }
  };

  //#endregion

  //#region shop

  const onCreateShop = () => {
    if (shops.length > 0) {
      const shop = new Shop(shops[0], shopLevel, cityLevel, playerLevel, reputation, shopType);
      const stock = shop.getInventory();
      setInventory(stock);
      db.setStock(worlds[0], cities[0], shops[0], stock);

      if (isMobile())
        setSidebarCollapsed(true)
    }
  };

  const onDeleteItem = (itemName, itemType) => {
    setInventory((prevInventory) => {
      let updatedInventory = [...prevInventory];

      const itemIndex = updatedInventory.findIndex(
        (item) => item.Name === itemName && item.ItemType === itemType
      );

      if (itemIndex !== -1) {
        const updatedItem = { ...updatedInventory[itemIndex] };
        updatedItem.Number = Math.max(0, updatedItem.Number - 1);
        updatedInventory[itemIndex] = updatedItem;
      }

      db.setStock(worlds[0], cities[0], shops[0], updatedInventory);

      return updatedInventory;
    });
  };

  const onAddItem = (number, itemName, itemType, cost) => {
    if (itemName.trim() === '' || number <= 0) {
      return;
    }

    setInventory((prevInventory) => {
      let updatedInventory = [...prevInventory];

      const itemIndex = updatedInventory.findIndex(
        (item) => item.Name === cap(itemName) && item.ItemType === itemType
      );

      if (itemIndex !== -1) {
        const updatedItem = { ...updatedInventory[itemIndex] };
        updatedItem.Number += Number(number);
        updatedInventory[itemIndex] = updatedItem;
      } else {
        const newItem = {
          Name: cap(itemName),
          ItemType: itemType,
          Cost: cost,
          Number: Number(number)
        };
        updatedInventory.push(newItem);
        updatedInventory.sort((a, b) => a.Name.localeCompare(b.Name));
        updatedInventory.sort((a, b) => a.ItemType.localeCompare(b.ItemType));
      }

      db.setStock(worlds[0], cities[0], shops[0], updatedInventory);

      return updatedInventory;
    });
  };

  //#endregion

  //#region return

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
    shopLevel: shopLevel,
    reputation: reputation,
    onNewShop: onNewShop,
    onSelectShop: onSelectShop,
    onShopLevelChange: onShopLevelChange,
    onReputationChange: onReputationChange,
    shopTypes: shopTypes() ?? [],
    shopType: shopType,
    onShopTypeChange: onShopTypeChange,
    onCreateShop: onCreateShop
  };

  return (
    <body className='app'>
      <Sidebar props={sidebarProps} />
      <header className='app-header'>
        <ShopInventory items={inventory} shopName={shops[0]} cityName={cities[0]} onDeleteItem={onDeleteItem} onAddItem={onAddItem} />
      </header>
    </body>
  );
}

//#endregion

export default App;
