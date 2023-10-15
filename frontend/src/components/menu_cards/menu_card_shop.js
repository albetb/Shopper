import React, { useState } from 'react';
import '../../style/menu_cards.css';

const MenuCardShop = ({ props }) => {
  const [isNewShopVisible, setIsNewShopVisible] = useState(false);
  const [shopName, setShopName] = useState('');

  const handleNewShopClick = () => {
    setIsNewShopVisible(true);
  };

  const handleOkClick = () => {
    props.onNewShop(shopName)
    setIsNewShopVisible(false);
    setShopName('');
  };

  const handleDropdownChange = (event) => {
    props.onSelectShop(event.target.value);
  };

  return (
            <div className="card-side-div">
              {isNewShopVisible ? (
                <>
                  <input className="modern-dropdown"
                    type="text"
                    placeholder="Shop name"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    />
                  <button className="modern-button" onClick={handleOkClick}>Ok</button>
                </>
              ) : (
                <>
                  <select className="modern-dropdown" onChange={handleDropdownChange} value={props.savedShops[0]}>
                    {props.savedShops.length > 0 ? (
                      props.savedShops.map((shop, index) => (
                        <option key={index} value={shop}>
                          {shop}
                        </option>
                      ))
                    ) : (
                      <option value="">Create a shop</option>
                    )}
                  </select>
                  <button className="modern-button" onClick={handleNewShopClick}>New shop</button>
                </>
              )}
            </div>
          );
};

export default MenuCardShop;
