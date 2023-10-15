import React, { useState, useEffect } from 'react';
import './style/App.css';
import Sidebar from './components/sidebar/sidebar';
import ShopInventory from './components/shop_inventory/shop_inventory';
import Shop from './lib/shop';
import { cap } from './lib/utils';

function App() {
  const [savedWorlds, setSavedWorlds] = useState([]);
  const [savedCities, setSavedCities] = useState([]);
  const [savedShops, setSavedShops] = useState([]);
  const [data, setData] = useState({
    player_level: 20,
    city_level: 5,
    shop_level: 10,
    reputation: 0,
    shop_type: 'Jeff'
  });
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const worlds = JSON.parse(localStorage.getItem(`saved_worlds`)) || [];
    setSavedWorlds(worlds);
    const cities = JSON.parse(localStorage.getItem(`saved_cities_${worlds[0]}`)) || [];
    setSavedCities(cities);
    const shops = JSON.parse(localStorage.getItem(`saved_shops_${worlds[0]}_${cities[0]}`)) || [];
    setSavedShops(shops);
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
    setSavedWorlds(worlds);
    localStorage.setItem(`saved_worlds`, JSON.stringify(worlds));

    const cities = JSON.parse(localStorage.getItem(`saved_cities_${worlds[0]}`)) || [];
    setSavedCities(cities);

    const shops = JSON.parse(localStorage.getItem(`saved_shops_${worlds[0]}_${cities[0]}`)) || [];
    setSavedShops(shops);
  };

  const onSelectCity = (city) => {
    const cities = setSelection(savedCities, city);
    setSavedCities(cities);
    localStorage.setItem(`saved_cities_${savedWorlds[0]}`, JSON.stringify(cities));

    const shops = JSON.parse(localStorage.getItem(`saved_shops_${savedWorlds[0]}_${cities[0]}`)) || [];
    setSavedShops(shops);
  };

  const onSelectShop = (shop) => {
    const shops = setSelection(savedShops, shop);
    setSavedShops(shops);
    localStorage.setItem(`saved_shops_${savedWorlds[0]}_${savedCities[0]}`, JSON.stringify(shops));
  };

  const onNewWorld = (world) => {
    if (world.trim() !== '') {
      const worlds = setSelection(savedWorlds, cap(world));
      setSavedWorlds(worlds);
      localStorage.setItem(`saved_worlds`, JSON.stringify(worlds));

      setSavedCities([]);
      setSavedShops([]);
    }
  };

  const onNewCity = (city) => {
    if (city.trim() !== '') {
      const cities = setSelection(savedCities, cap(city));
      setSavedCities(cities);
      localStorage.setItem(`saved_cities_${savedWorlds[0]}`, JSON.stringify(cities));

      setSavedShops([]);
    }
  };

  const onNewShop = (shopName) => {
    if (shopName.trim() !== '') {
      const shops = setSelection(savedShops, cap(shopName));
      setSavedShops(shops);
      localStorage.setItem(`saved_shops_${savedWorlds[0]}_${savedCities[0]}`, JSON.stringify(shops));

      const shop = new Shop(shopName, data.shop_level, data.city_level, data.player_level, data.reputation, data.shop_type);
      setInventory(shop.stock);
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
    savedShops: savedShops ?? []
  };

  return (
      <body className="App">
        <Sidebar props={sidebarProps}/>
        <header className="App-header">
          <ShopInventory items={inventory}/>
        </header>
      </body>
  );
}

export default App;
