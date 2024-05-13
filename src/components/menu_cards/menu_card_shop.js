import React, { useState } from 'react';
import SelectComponent from '../common/select_component';
import CreateComponent from '../common/create_component';
import LevelComponent from '../common/level_component';
import '../../style/menu_cards.css';

const MenuCardShop = ({ props }) => {
  const [isNewShopVisible, setIsNewShopVisible] = useState(false);

  const setIsVisible = (isVisible) => {
    setIsNewShopVisible(isVisible);
  };

  const handleShopTypeChange = (event) => {
    props.onShopTypeChange(event.target.value);
  };

  const handleGenerateInventory = () => {
    props.onCreateShop();
  };

  const createComponentProps = {
    saved: props.savedShops,
    tabName: 'shop',
    onNew: props.onNewShop,
    setIsVisible: setIsVisible
  };

  const selectComponentProps = {
    saved: props.savedShops,
    tabName: 'shop',
    setIsVisible: setIsVisible,
    onSelect: props.onSelectShop
  };

  const shopLevelComponentProps = {
    level: props.shopLevel,
    levelName: 'Shop level',
    onLevelChange: props.onShopLevelChange
  };

  const reputationLevelComponentProps = {
    level: props.reputation,
    levelName: 'Reputation',
    onLevelChange: props.onReputationChange
  };

  return (
    <>
      {isNewShopVisible ? (
        <CreateComponent props={createComponentProps} />
      ) : (
        <>
          <SelectComponent props={selectComponentProps} />
          {props.savedShops.length > 0 && (
            <>
              <LevelComponent props={shopLevelComponentProps} />
              <LevelComponent props={reputationLevelComponentProps} />
              <div className='card-side-div margin-top'>
                <label className='modern-label'>Shop Type:</label>
                <select
                  className='modern-dropdown'
                  value={props.shopType}
                  onChange={handleShopTypeChange}
                >
                  {props.shopTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className='card-side-div margin-top'>
                <button className='modern-button' onClick={handleGenerateInventory}>Generate</button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default MenuCardShop;
