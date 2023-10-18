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
  const [inventoryLabel, setInventoryLabel] = useState('');

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
      const city_level = localStorage.getItem(`${worlds[0]}_${cities[0]}_level`) || 1;
      setCityLevel(city_level);
    }

    const shops = JSON.parse(localStorage.getItem(`saved_shops_${worlds[0]}_${cities[0]}`)) || [];
    setSavedShops(shops);
    if (shops.length > 0){
      const shop_level = localStorage.getItem(`${worlds[0]}_${cities[0]}_${shops[0]}_level`) || 0;
      setShopLevel(shop_level);
      const reputation_level = localStorage.getItem(`${worlds[0]}_${cities[0]}_${shops[0]}_reputation`) || 0;
      setReputation(reputation_level);
      const shop_type = localStorage.getItem(`${worlds[0]}_${cities[0]}_${shops[0]}_type`) || '';
      setSelectedShopType(shop_type);
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

  const onSelectWorld = (world) => {
    const worlds = setSelection(savedWorlds, world);
    localStorage.setItem(`saved_worlds`, JSON.stringify(worlds));

    setWorldFromStorage(worlds);
  };

  const setWorldFromStorage = (worlds) => {
    setSavedWorlds(worlds);
    const world_level = localStorage.getItem(`${worlds[0]}_level`);
    setPlayerLevel(world_level);

    setCityFromStorage(worlds[0]);
  }

  const onSelectCity = (city) => {
    const cities = setSelection(savedCities, city);
    localStorage.setItem(`saved_cities_${savedWorlds[0]}`, JSON.stringify(cities));

    setCityFromStorage(savedWorlds[0], cities);
  };

  const setCityFromStorage = (world, cities = null) => {
    const cities_list = cities ?? (JSON.parse(localStorage.getItem(`saved_cities_${world}`)) || []);
    setSavedCities(cities_list);
    const city_level = localStorage.getItem(`${world}_${cities_list[0]}_level`);
    setCityLevel(city_level);

    setShopFromStorage(world, cities_list[0]);
  }

  const onSelectShop = (shop) => {
    const shops = setSelection(savedShops, shop);
    localStorage.setItem(`saved_shops_${savedWorlds[0]}_${savedCities[0]}`, JSON.stringify(shops));

    setShopFromStorage(savedWorlds[0], savedCities[0], shops);
  };

  const setShopFromStorage = (world, city, shops = null) => {
    const shops_list = shops ?? (JSON.parse(localStorage.getItem(`saved_shops_${world}_${city}`)) || []);
    setSavedShops(shops_list);
    const shop_level = localStorage.getItem(`${world}_${city}_${shops_list[0]}_level`) || 0;
    setShopLevel(shop_level);
    const reputation_level = localStorage.getItem(`${world}_${city}_${shops_list[0]}_reputation`) || 0;
    setReputation(reputation_level);
    const shop_type = localStorage.getItem(`${world}_${city}_${shops_list[0]}_type`) || '';
    setSelectedShopType(shop_type);
  }

  const onNewWorld = (world) => {
    if (world.trim() !== '' && !savedWorlds.includes(world)) {
      const worlds = setSelection(savedWorlds, cap(world));
      setSavedWorlds(worlds);
      localStorage.setItem(`saved_worlds`, JSON.stringify(worlds));
      setPlayerLevel(1);
      localStorage.setItem(`${worlds[0]}_level`, 1);
      setCityLevel(1);
      setShopLevel(0);
      setReputation(0);
      setSelectedShopType('');

      setSavedCities([]);
      setSavedShops([]);
    }
  };

  const onNewCity = (city) => {
    if (city.trim() !== '' && !savedCities.includes(city)) {
      const cities = setSelection(savedCities, cap(city));
      setSavedCities(cities);
      localStorage.setItem(`saved_cities_${savedWorlds[0]}`, JSON.stringify(cities));
      setCityLevel(1);
      localStorage.setItem(`${savedWorlds[0]}_${cities[0]}_level`, 1);
      setShopLevel(0);
      setReputation(0);
      setSelectedShopType('');

      setSavedShops([]);
    }
  };

  const onNewShop = (shopName) => {
    if (shopName.trim() !== '' && !savedShops.includes(shopName)) {
      const shops = setSelection(savedShops, cap(shopName));
      setSavedShops(shops);
      localStorage.setItem(`saved_shops_${savedWorlds[0]}_${savedCities[0]}`, JSON.stringify(shops));
      setShopLevel(0);
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_${shopName}_level`, 0);
      setReputation(0);
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_${shopName}_reputation`, 0);
      setSelectedShopType('');
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_${shopName}_type`, '');
    }
  };

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

  const onCreateShop = () => {
    if (savedShops.length > 0) {
      const shop = new Shop(savedShops[0], shopLevel, cityLevel, playerLevel, reputation, selectedShopType);
      const shop_inventory = shop.getInventory();
      setInventory(shop_inventory);
      const inventoryLabelText = `${savedShops[0]} from ${savedCities[0]}`;
      setInventoryLabel(inventoryLabelText);

      if (isMobile()){
        setIsSidebarCollapsed(true)
      }
    }
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
          <ShopInventory items={inventory} inventoryLabel={inventoryLabel}/>
        </header>
      </body>
  );
}

export default App;
