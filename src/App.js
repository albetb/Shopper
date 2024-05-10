import React, { useState, useEffect } from 'react';
import './style/App.css';
import Sidebar from './components/sidebar/sidebar';
import ShopInventory from './components/shop_inventory/shop_inventory';
import Shop from './lib/shop';
import { cap, shopTypes, isMobile } from './lib/utils';
import * as storage from './lib/storage';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [savedWorlds, setSavedWorlds] = useState([]);
  const [savedCities, setSavedCities] = useState([]);
  const [savedShops, setSavedShops] = useState([]);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [cityLevel, setCityLevel] = useState(1);
  const [shopLevel, setShopLevel] = useState(0);
  const [reputation, setReputation] = useState(0);
  const [selectedShopType, setSelectedShopType] = useState('');
  const [inventory, setInventory] = useState([]);
  const [currentShop, setCurrentShop] = useState('');
  const [currentCity, setCurrentCity] = useState('');

  useEffect(() => {
    const worlds = storage.getWorlds();
    setSavedWorlds(worlds);
    
    if (worlds.length > 0){
      setPlayerLevel(storage.getPlayerLevel(worlds[0]));
    }

    const cities = storage.getCities(worlds[0]);
    setSavedCities(cities);

    if (cities.length > 0){
      setCurrentCity(cities[0]);
      const city_level = storage.getCityLevel(worlds[0], cities[0]);
      setCityLevel(city_level);
    }

    const shops = storage.getShops(worlds[0], cities[0]);
    setSavedShops(shops);

    if (shops.length > 0){
      setCurrentShop(shops[0]);
      setShopLevel(storage.getShopLevel(worlds[0], cities[0], shops[0]));
      setReputation(storage.getReputation(worlds[0], cities[0], shops[0]));
      setSelectedShopType(storage.getShopType(worlds[0], cities[0], shops[0]));
      setInventory(storage.getInventory(worlds[0], cities[0], shops[0]));
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  
  const setSelection = (list, element) => {
    if (list){
      list = list.filter(item => item !== element);
      list.sort();
      return [element].concat(list);
    }
    return [element];
  }

  //#region onSelect

  const onSelectWorld = (world) => {
    const worlds = setSelection(savedWorlds, world);
    storage.setWorlds(worlds);

    setWorldFromStorage(worlds);
  };

  const onSelectCity = (city) => {
    const cities = setSelection(savedCities, city);
    storage.setCities(savedWorlds[0], cities);

    setCityFromStorage(savedWorlds[0], cities);
  };

  const onSelectShop = (shop) => {
    const shops = setSelection(savedShops, shop);
    storage.setShops(savedWorlds[0], savedCities[0], shops);

    setShopFromStorage(savedWorlds[0], savedCities[0], shops);
  };

  //#endregion

  //#region setFromStorage

  const setWorldFromStorage = (worlds) => {
    setSavedWorlds(worlds);
    setPlayerLevel(storage.getPlayerLevel(worlds[0]));

    setCityFromStorage(worlds[0]);
  }

  const setCityFromStorage = (world, cities = null) => {
    const cities_list = cities ?? storage.getCities(world);
    setSavedCities(cities_list);
    setCurrentCity(cities_list[0]);
    setCityLevel(storage.getCityLevel(world, cities_list[0]));

    setShopFromStorage(world, cities_list[0]);
  }

  const setShopFromStorage = (world, city, shops = null) => {
    const shops_list = shops ?? storage.getShops(world, city);
    setSavedShops(shops_list);
    setCurrentShop(shops_list[0]);
    setShopLevel(storage.getShopLevel(world, city, shops_list[0]));
    setReputation(storage.getReputation(world, city, shops_list[0]));
    setSelectedShopType(storage.getShopType(world, city, shops_list[0]));
    setInventory(storage.getInventory(world, city, shops_list[0]));
  }

  //#endregion

  //#region onNew

  const onNewWorld = (world) => {
    if (world.trim() !== '' && !savedWorlds.includes(cap(world))) {
      const worlds = setSelection(savedWorlds, cap(world));
      setSavedWorlds(worlds);
      storage.setWorlds(worlds);
      onPlayerLevelChange(1);

      setSavedCities([]);
      setSavedShops([]);
      setInventory([]);
    }
  };

  const onNewCity = (city) => {
    if (city.trim() !== '' && !savedCities.includes(cap(city))) {
      const cities = setSelection(savedCities, cap(city));
      setSavedCities(cities);
      storage.setCities(savedWorlds[0], cities);
      onCityLevelChange(1);

      setSavedShops([]);
      setInventory([]);
    }
  };

  const onNewShop = (shopName) => {
    if (shopName.trim() !== '' && !savedShops.includes(cap(shopName))) {
      const shops = setSelection(savedShops, cap(shopName));
      setSavedShops(shops);
      storage.setShops(savedWorlds[0], savedCities[0], shops);
      onShopLevelChange(0);
      onReputationChange(0);
      onShopTypeChange('');
      setInventory([]);
    }
  };

  //#endregion

  //#region onChange
  
  const onPlayerLevelChange = (level) => {
    if (level && parseInt(level) > 0 && parseInt(level) < 100){
      setPlayerLevel(level);
      storage.setPlayerLevel(savedWorlds[0], level);
    }
  };

  const onCityLevelChange = (level) => {
    if (level && parseInt(level) > 0 && parseInt(level) < 6){
      setCityLevel(level);
      storage.setCityLevel(savedWorlds[0], savedCities[0], level);
    }
  };

  const onShopLevelChange = (level) => {
    if ((level || parseInt(level) === 0) && parseFloat(level) > -1 && parseFloat(level) < 11){
      setShopLevel(level);
      storage.setShopLevel(savedWorlds[0], savedCities[0], savedShops[0], level);
    }
  };

  const onReputationChange = (level) => {
    if ((level || parseInt(level) === 0) && parseFloat(level) > -11 && parseFloat(level) < 11){
      setReputation(level);
      storage.setReputation(savedWorlds[0], savedCities[0], savedShops[0], level);
    }
  };

  const onShopTypeChange = (shop_type) => {
    setSelectedShopType(shop_type);
    storage.setShopType(savedWorlds[0], savedCities[0], savedShops[0], shop_type);
  };
  
  //#endregion

  const onCreateShop = () => {
    if (savedShops.length > 0) {
      const shop = new Shop(savedShops[0], shopLevel, cityLevel, playerLevel, reputation, selectedShopType);
      const shop_inventory = shop.getInventory();
      setInventory(shop_inventory);
      setCurrentCity(savedCities[0]);
      setCurrentShop(savedShops[0]);
      storage.setStock(savedWorlds[0], savedCities[0], savedShops[0], shop_inventory);

      if (isMobile()){
        setIsSidebarCollapsed(true)
      }
    }
  };

  const onDeleteItem = (itemName, itemType) => {
    setInventory((prevInventory) => {
      let updatedInventory = [...prevInventory];
  
      const itemIndex = updatedInventory.findIndex(
        (item) => item.Name === itemName && item.ItemType === itemType
      );
  
      // If the item is found, decrease its number by one
      if (itemIndex !== -1) {
        const updatedItem = { ...updatedInventory[itemIndex] };
        updatedItem.Number = Math.max(0, updatedItem.Number - 1);
        updatedInventory[itemIndex] = updatedItem;
      }

      // Update local storage
      storage.setStock(savedWorlds[0], savedCities[0], savedShops[0], updatedInventory);
      
      return updatedInventory;
    });
  };

  const onAddItem = (number, itemName, itemType, cost) => {
    // Check if the item name is not empty and the number is more than zero
    if (itemName.trim() === '' || number <= 0) {
      // Handle invalid input (you may show an alert or provide feedback)
      return;
    }
  
    setInventory((prevInventory) => {
      let updatedInventory = [...prevInventory];
  
      // Check if the item already exists in the inventory
      const itemIndex = updatedInventory.findIndex(
        (item) => item.Name === cap(itemName) && item.ItemType === itemType
      );
  
      if (itemIndex !== -1) {
        // If the item exists, increase its number by the specified amount
        const updatedItem = { ...updatedInventory[itemIndex] };
        updatedItem.Number += Number(number);
        updatedInventory[itemIndex] = updatedItem;
      } else {
        // If the item doesn't exist, add it to the inventory
        const newItem = {
          Name: cap(itemName),
          ItemType: itemType,
          Cost: cost,
          Number: Number(number),
          // Add other properties if needed
        };
        updatedInventory.push(newItem);
        updatedInventory.sort((a, b) => a.Name.localeCompare(b.Name));
        updatedInventory.sort((a, b) => a.ItemType.localeCompare(b.ItemType));
      }
  
      // Update local storage
      storage.setStock(savedWorlds[0], savedCities[0], savedShops[0], updatedInventory);
  
      return updatedInventory;
    });
  };

  var sidebarProps = {
    isSidebarCollapsed: isSidebarCollapsed,
    toggleSidebar: toggleSidebar,
    savedWorlds: savedWorlds ?? [],
    playerLevel: playerLevel,
    onNewWorld: onNewWorld,
    onSelectWorld: onSelectWorld,
    onPlayerLevelChange: onPlayerLevelChange,
    savedCities: savedCities ?? [],
    cityLevel: cityLevel,
    onNewCity: onNewCity,
    onSelectCity: onSelectCity,
    onCityLevelChange: onCityLevelChange,
    savedShops: savedShops ?? [],
    shopLevel: shopLevel,
    reputation: reputation,
    onNewShop: onNewShop,
    onSelectShop: onSelectShop,
    onShopLevelChange: onShopLevelChange,
    onReputationChange: onReputationChange,
    shopTypes: shopTypes() ?? [],
    selectedShopType: selectedShopType,
    onShopTypeChange: onShopTypeChange,
    onCreateShop: onCreateShop
  };

  return (
      <body className='app'>
        <Sidebar props={sidebarProps}/>
        <header className='app-header'>
          <ShopInventory items={inventory} shopName={currentShop} cityName={currentCity} onDeleteItem={onDeleteItem} onAddItem={onAddItem}/>
        </header>
      </body>
  );
}

export default App;
