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
  
  const handleShopLevelChange = (event) => {
    const level = parseInt(event.target.value);
    props.onShopLevelChange(level);
  };
  
  const handleReputationChange = (event) => {
    const level = parseInt(event.target.value);
    props.onReputationChange(level);
  };

  const handleShopTypeChange = (event) => {
    props.onShopTypeChanged(event.target.value);
  };

  const handleGenerateInventory = () => {
    props.onCreateShop();
  };

  return (
            <>
                {isNewShopVisible ? (
                  <>
                    <div className="card-side-div">
                      <input className="modern-dropdown"
                        type="text"
                        placeholder="Shop name"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        />
                      <button className="modern-button" onClick={handleOkClick}>Ok</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="card-side-div">
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
                    </div>
                    {props.savedShops.length > 0 && (
                      <>
                        <div className="card-side-div margin-top">
                          <label className="modern-label">Shop Level:</label>
                          <input
                            className="modern-dropdown"
                            type="number"
                            value={props.shopLevel}
                            onChange={handleShopLevelChange}
                            min="0"
                            max="10"
                            />
                        </div>
                        <div className="card-side-div margin-top">
                          <label className="modern-label">Reputation:</label>
                          <input
                            className="modern-dropdown"
                            type="number"
                            value={props.reputation}
                            onChange={handleReputationChange}
                            min="-10"
                            max="10"
                            />
                        </div>
                        <div className="card-side-div margin-top">
                          <label className="modern-label">Shop Type:</label>
                          <select
                            className="modern-dropdown"
                            value={props.selectedShopType}
                            onChange={handleShopTypeChange}
                          >
                            {props.shopTypes.map((type, index) => (
                              <option key={index} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="card-side-div margin-top">
                          <button className="modern-button" onClick={handleGenerateInventory}>Generate</button>
                        </div>
                      </>
                    )}
                  </>
                )}
            </>
          );
};

export default MenuCardShop;
