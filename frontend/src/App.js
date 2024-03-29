import React, { useState, useEffect } from 'react';
import './style/App.css';
import Sidebar from './components/sidebar/sidebar';
import ShopInventory from './components/shop_inventory/shop_inventory';
import Shop from './lib/shop';
import { cap, shopNames, isMobile } from './lib/utils';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [savedWorlds, setSavedWorlds] = useState([]);
  const [savedCities, setSavedCities] = useState([]);
  const [savedShops, setSavedShops] = useState([]);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [cityLevel, setCityLevel] = useState(1);
  const [shopLevel, setShopLevel] = useState(0);
  const [reputation, setReputation] = useState(0);
  const [shopTypes, setShopTypes] = useState([]);
  const [selectedShopType, setSelectedShopType] = useState('');
  const [inventory, setInventory] = useState([]);
  const [currentShop, setCurrentShop] = useState('');
  const [currentCity, setCurrentCity] = useState('');

  useEffect(() => {
    const worlds = JSON.parse(localStorage.getItem(`saved_worlds`)) || [];
    setSavedWorlds(worlds);
    
    if (worlds.length > 0){
      const player_level = localStorage.getItem(`${worlds[0]}_level`) || 1;
      setPlayerLevel(player_level);
    }

    const cities = JSON.parse(localStorage.getItem(`saved_cities_${worlds[0]}`)) || [];
    setSavedCities(cities);

    if (cities.length > 0){
      setCurrentCity(cities[0]);
      const city_level = localStorage.getItem(`${worlds[0]}_${cities[0]}_level`) || 1;
      setCityLevel(city_level);
    }

    const shops = JSON.parse(localStorage.getItem(`saved_shops_${worlds[0]}_${cities[0]}`)) || [];
    setSavedShops(shops);

    if (shops.length > 0){
      setCurrentShop(shops[0]);
      const shop_level = localStorage.getItem(`${worlds[0]}_${cities[0]}_${shops[0]}_level`) || 0;
      setShopLevel(shop_level);
      const reputation_level = localStorage.getItem(`${worlds[0]}_${cities[0]}_${shops[0]}_reputation`) || 0;
      setReputation(reputation_level);
      const shop_type = localStorage.getItem(`${worlds[0]}_${cities[0]}_${shops[0]}_type`) || '';
      setSelectedShopType(shop_type);
      const inventory = JSON.parse(localStorage.getItem(`${worlds[0]}_${cities[0]}_${shops[0]}_stock`)) || [];
      setInventory(inventory);
    }

    const shop_types = shopNames();
    setShopTypes(shop_types);
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
    localStorage.setItem(`saved_worlds`, JSON.stringify(worlds));

    setWorldFromStorage(worlds);
  };

  const onSelectCity = (city) => {
    const cities = setSelection(savedCities, city);
    localStorage.setItem(`saved_cities_${savedWorlds[0]}`, JSON.stringify(cities));

    setCityFromStorage(savedWorlds[0], cities);
  };

  const onSelectShop = (shop) => {
    const shops = setSelection(savedShops, shop);
    localStorage.setItem(`saved_shops_${savedWorlds[0]}_${savedCities[0]}`, JSON.stringify(shops));

    setShopFromStorage(savedWorlds[0], savedCities[0], shops);
  };

  //#endregion

  //#region setFromStorage

  const setWorldFromStorage = (worlds) => {
    setSavedWorlds(worlds);
    const world_level = localStorage.getItem(`${worlds[0]}_level`);
    setPlayerLevel(world_level);

    setCityFromStorage(worlds[0]);
  }

  const setCityFromStorage = (world, cities = null) => {
    const cities_list = cities ?? (JSON.parse(localStorage.getItem(`saved_cities_${world}`)) || []);
    setSavedCities(cities_list);
    setCurrentCity(cities_list[0]);
    const city_level = localStorage.getItem(`${world}_${cities_list[0]}_level`);
    setCityLevel(city_level);

    setShopFromStorage(world, cities_list[0]);
  }

  const setShopFromStorage = (world, city, shops = null) => {
    const shops_list = shops ?? (JSON.parse(localStorage.getItem(`saved_shops_${world}_${city}`)) || []);
    setSavedShops(shops_list);
    setCurrentShop(shops_list[0]);
    const shop_level = localStorage.getItem(`${world}_${city}_${shops_list[0]}_level`) || 0;
    setShopLevel(shop_level);
    const reputation_level = localStorage.getItem(`${world}_${city}_${shops_list[0]}_reputation`) || 0;
    setReputation(reputation_level);
    const shop_type = localStorage.getItem(`${world}_${city}_${shops_list[0]}_type`) || '';
    setSelectedShopType(shop_type);
    const inventory = JSON.parse(localStorage.getItem(`${world}_${city}_${shops_list[0]}_stock`)) || [];
    setInventory(inventory);
  }

  //#endregion

  //#region onNew

  const onNewWorld = (world) => {
    if (world.trim() !== '' && !savedWorlds.includes(cap(world))) {
      const worlds = setSelection(savedWorlds, cap(world));
      setSavedWorlds(worlds);
      localStorage.setItem(`saved_worlds`, JSON.stringify(worlds));
      setPlayerLevel(1);
      localStorage.setItem(`${cap(world)}_level`, 1);
      setCityLevel(1);
      setShopLevel(0);
      setReputation(0);
      setSelectedShopType('');

      setSavedCities([]);
      setSavedShops([]);
    }
  };

  const onNewCity = (city) => {
    if (city.trim() !== '' && !savedCities.includes(cap(city))) {
      const cities = setSelection(savedCities, cap(city));
      setSavedCities(cities);
      localStorage.setItem(`saved_cities_${savedWorlds[0]}`, JSON.stringify(cities));
      setCityLevel(1);
      localStorage.setItem(`${savedWorlds[0]}_${cap(city)}_level`, 1);
      setShopLevel(0);
      setReputation(0);
      setSelectedShopType('');

      setSavedShops([]);
    }
  };

  const onNewShop = (shopName) => {
    if (shopName.trim() !== '' && !savedShops.includes(cap(shopName))) {
      const shops = setSelection(savedShops, cap(shopName));
      setSavedShops(shops);
      localStorage.setItem(`saved_shops_${savedWorlds[0]}_${savedCities[0]}`, JSON.stringify(shops));
      setShopLevel(0);
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_${cap(shopName)}_level`, 0);
      setReputation(0);
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_${cap(shopName)}_reputation`, 0);
      setSelectedShopType('');
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_${cap(shopName)}_type`, '');
      setInventory([]);
    }
  };

  //#endregion

  //#region onChange
  
  const onPlayerLevelChange = (level) => {
    if (level && level !== playerLevel && parseInt(level) > 0 && parseInt(level) < 100){
      setPlayerLevel(level);
      localStorage.setItem(`${savedWorlds[0]}_level`, level);
    }
  };

  const onCityLevelChange = (level) => {
    if (level && level !== cityLevel && parseInt(level) > 0 && parseInt(level) < 6){
      setCityLevel(level);
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_level`, level);
    }
  };

  const onShopLevelChange = (level) => {
    if ((level || parseInt(level) === 0) && level !== shopLevel && parseFloat(level) > -1 && parseFloat(level) < 11){
      setShopLevel(level);
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_${savedShops[0]}_level`, level);
    }
  };

  const onReputationChange = (level) => {
    if ((level || parseInt(level) === 0) && level !== reputation && parseFloat(level) > -11 && parseFloat(level) < 11){
      setReputation(level);
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_${savedShops[0]}_reputation`, level);
    }
  };

  const onShopTypeChanged = (shop_type) => {
    if (shop_type !== selectedShopType){
      setSelectedShopType(shop_type);
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_${savedShops[0]}_type`, shop_type);
    }
  };
  
  //#endregion

  const onCreateShop = () => {
    if (savedShops.length > 0) {
      const shop = new Shop(savedShops[0], shopLevel, cityLevel, playerLevel, reputation, selectedShopType);
      const shop_inventory = shop.getInventory();
      setInventory(shop_inventory);
      setCurrentCity(savedCities[0]);
      setCurrentShop(savedShops[0]);
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_${savedShops[0]}_stock`, JSON.stringify(shop_inventory));

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
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_${savedShops[0]}_stock`,JSON.stringify(updatedInventory));
      
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
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_${savedShops[0]}_stock`, JSON.stringify(updatedInventory));
  
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
    shopTypes: shopTypes ?? [],
    selectedShopType: selectedShopType,
    onShopTypeChanged: onShopTypeChanged,
    onCreateShop: onCreateShop
  };

  return (
      <body className="app">
        <Sidebar props={sidebarProps}/>
        <header className="app-header">
          <ShopInventory items={inventory} shopName={currentShop} cityName={currentCity} onDeleteItem={onDeleteItem} onAddItem={onAddItem}/>
        </header>
      </body>
  );
}

export default App;
