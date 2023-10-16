import React, { useState, useEffect } from 'react';
import './style/app.css';
import Sidebar from './components/sidebar/sidebar';
import ShopInventory from './components/shop_inventory/shop_inventory';
import Shop from './lib/shop';
import { cap } from './lib/utils';

function App() {
  const [savedWorlds, setSavedWorlds] = useState([]);
  const [savedCities, setSavedCities] = useState([]);
  const [savedShops, setSavedShops] = useState([]);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [cityLevel, setCityLevel] = useState(1);
  const [shopLevel, setShopLevel] = useState(0);
  const [reputation, setReputation] = useState(0);
  const [data, setData] = useState({
    player_level: 1,
    city_level: 0,
    shop_level: 0,
    reputation: 0,
    shop_type: ''
  });
  const [inventory, setInventory] = useState([]);

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
    }
  }, []);

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
  }

  const onNewWorld = (world) => {
    if (world.trim() !== '') {
      const worlds = setSelection(savedWorlds, cap(world));
      setSavedWorlds(worlds);
      localStorage.setItem(`saved_worlds`, JSON.stringify(worlds));
      setPlayerLevel(1);
      localStorage.setItem(`${worlds[0]}_level`, 1);
      setCityLevel(1);
      setShopLevel(0);
      setReputation(0);

      setSavedCities([]);
      setSavedShops([]);
    }
  };

  const onNewCity = (city) => {
    if (city.trim() !== '') {
      const cities = setSelection(savedCities, cap(city));
      setSavedCities(cities);
      localStorage.setItem(`saved_cities_${savedWorlds[0]}`, JSON.stringify(cities));
      setCityLevel(1);
      localStorage.setItem(`${savedWorlds[0]}_${cities[0]}_level`, 1);
      setShopLevel(0);
      setReputation(0);

      setSavedShops([]);
    }
  };

  const onNewShop = (shopName) => {
    if (shopName.trim() !== '') {
      const shops = setSelection(savedShops, cap(shopName));
      setSavedShops(shops);
      localStorage.setItem(`saved_shops_${savedWorlds[0]}_${savedCities[0]}`, JSON.stringify(shops));
      setShopLevel(0);
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_${shopName}_level`, 0);
      setReputation(0);
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_${shopName}_reputation`, 0);

      const shop = new Shop(shopName, shopLevel, cityLevel, playerLevel, reputation, data.shop_type);
      setInventory(shop.stock);
    }
  };

  const onPlayerLevelChange = (level) => {
    if (level !== playerLevel){
      setPlayerLevel(level);
      localStorage.setItem(`${savedWorlds[0]}_level`, level);
    }
  };

  const onCityLevelChange = (level) => {
    if (level !== cityLevel){
      setCityLevel(level);
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_level`, level);
    }
  };

  const onShopLevelChange = (level) => {
    if (level !== shopLevel){
      setShopLevel(level);
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_${savedShops[0]}_level`, level);
    }
  };

  const onReputationChange = (level) => {
    if (level !== cityLevel){
      setReputation(level);
      localStorage.setItem(`${savedWorlds[0]}_${savedCities[0]}_${savedShops[0]}_reputation`, level);
    }
  };

  var sidebarProps = {
    onSelectWorld: onSelectWorld,
    onSelectCity: onSelectCity,
    onSelectShop: onSelectShop,
    onNewWorld: onNewWorld,
    onNewCity: onNewCity,
    onNewShop: onNewShop,
    savedWorlds: savedWorlds ?? [],
    savedCities: savedCities ?? [],
    savedShops: savedShops ?? [],
    playerLevel: playerLevel,
    onPlayerLevelChange: onPlayerLevelChange,
    cityLevel: cityLevel,
    onCityLevelChange: onCityLevelChange,
    shopLevel: shopLevel,
    onShopLevelChange: onShopLevelChange,
    reputation: reputation,
    onReputationChange: onReputationChange
  };

  return (
      <body className="app">
        <Sidebar props={sidebarProps}/>
        <header className="app-header">
          <ShopInventory items={inventory}/>
        </header>
      </body>
  );
}

export default App;
