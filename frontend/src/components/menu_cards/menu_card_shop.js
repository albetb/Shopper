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

  const handleShopTypeChange = (event) => {
    props.onShopTypeChanged(event.target.value);
  };

  const handleGenerateInventory = () => {
    props.onCreateShop();
  };
  
  const handleShopLevelDecrement = () => {
    const level = parseInt(props.shopLevel);
    props.onShopLevelChange(level - 1);
  };
  
  const handleShopLevelIncrement = () => {
    const level = parseInt(props.shopLevel);
    props.onShopLevelChange(level + 1);
  };
  
  const handleReputationIncrement = () => {
    const level = parseInt(props.reputation);
    props.onReputationChange(level + 1);
  };
  
  const handleReputationDecrement = () => {
    const level = parseInt(props.reputation);
    props.onReputationChange(level - 1);
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
                          <div className='levels-div'>
                            <button className="levels-button" onClick={handleShopLevelDecrement}>-</button>
                              <div className='level-frame'> 
                                <label className="level-text">{props.shopLevel}</label>
                              </div>
                            <button className="levels-button" onClick={handleShopLevelIncrement}>+</button>
                          </div>
                        </div>
                        <div className="card-side-div margin-top">
                          <label className="modern-label">Reputation:</label>
                          <div className='levels-div'>
                            <button className="levels-button" onClick={handleReputationDecrement}>-</button>
                              <div className='level-frame'> 
                                <label className="level-text">{props.reputation}</label>
                              </div>
                            <button className="levels-button" onClick={handleReputationIncrement}>+</button>
                          </div>
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
