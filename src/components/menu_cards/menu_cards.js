import React, { useState, useEffect } from 'react';
import MenuCardWorld from './menu_card_world';
import MenuCardCity from './menu_card_city';
import MenuCardShop from './menu_card_shop';
import { isMobile, trimLine } from '../../lib/utils';
import * as db from '../../lib/storage';
import '../../style/menu_cards.css';

const MenuCards = ({ props }) => {
  const [cardStates, setCardStates] = useState([
    { id: 1, collapsed: false },
    { id: 2, collapsed: false },
    { id: 3, collapsed: false }
  ]);

  useEffect(() => {
    const isWorldCollapsed = db.getIsWorldCollapsed();
    setCardCollapsed(1, isWorldCollapsed);
    const isCityCollapsed = db.getIsCityCollapsed();
    setCardCollapsed(2, isCityCollapsed);
    const isShopCollapsed = db.getIsShopCollapsed();
    setCardCollapsed(3, isShopCollapsed);
  }, []);

  const setCardCollapsed = (cardId, isCollapsed) => {
    setCardStates((prevStates) => {
      return prevStates.map((cardState) => {
        if (cardState.id === cardId) {
          return { ...cardState, collapsed: isCollapsed };
        }
        return cardState;
      });
    });
  };

  const cards = [
    { id: 1, title: 'World' },
    { id: 2, title: 'City' },
    { id: 3, title: 'Shop' }
  ];

  const toggleCard = (cardId) => {
    setCardStates((prevStates) => {
      return prevStates.map((cardState) => {
        if (cardState.id === cardId) {
          let cardName = '';
          switch (cardId) {
            case 1:
              cardName = 'world';
              db.setIsWorldCollapsed(!cardState.collapsed);
              break;
            case 2:
              cardName = 'city';
              db.setIsCityCollapsed(!cardState.collapsed);
              break;
            case 3:
              cardName = 'shop';
              db.setIsShopCollapsed(!cardState.collapsed);
              break;
            default:
              return { ...cardState, collapsed: !cardState.collapsed };
          }

          return { ...cardState, collapsed: !cardState.collapsed };
        }
        return cardState;
      });
    });
  };

  const cardContentVisible = (cardId) => {
    switch (cardId) {
      case 2:
        return props.savedWorlds && props.savedWorlds.length > 0;
      case 3:
        return props.savedCities && props.savedCities.length > 0;
      default:
        return true;
    }
  };

  const cardTitle = (cardId, cardTitle) => {
    const trimLength = isMobile() ? 23 : 10;
    const formatText = (name, lv) => ` - ${trimLine(name, trimLength)} - Lv: ${lv}`;

    if (cardId === 1 && props.savedWorlds && props.savedWorlds.length > 0) {
      return `${cardTitle}${formatText(props.savedWorlds[0], props.playerLevel)}`;
    }
    else if (cardId === 2 && props.savedCities && props.savedCities.length > 0) {
      return `${cardTitle}${formatText(props.savedCities[0], props.cityLevel)}`;
    }
    else if (cardId === 3 && props.savedShops && props.savedShops.length > 0) {
      return `${cardTitle}${formatText(props.savedShops[0], parseInt(props.shopLevel))}`;
    }

    return cardTitle;
  };

  var menuCardWorldProps = {
    onSelectWorld: props.onSelectWorld,
    onNewWorld: props.onNewWorld,
    savedWorlds: props.savedWorlds,
    playerLevel: props.playerLevel,
    onPlayerLevelChange: props.onPlayerLevelChange,
    onDeleteItem: props.onDeleteWorld,
    isShopGenerated: props.isShopGenerated,
    onWaitTime: props.onWaitTime
  };

  var menuCardCityProps = {
    onSelectCity: props.onSelectCity,
    onNewCity: props.onNewCity,
    savedCities: props.savedCities,
    cityLevel: props.cityLevel,
    onCityLevelChange: props.onCityLevelChange,
    onDeleteItem: props.onDeleteCity
  };

  var menuCardShopProps = {
    onSelectShop: props.onSelectShop,
    onNewShop: props.onNewShop,
    savedShops: props.savedShops,
    shopLevel: props.shopLevel,
    onShopLevelChange: props.onShopLevelChange,
    reputation: props.reputation,
    onReputationChange: props.onReputationChange,
    shopTypes: props.shopTypes ?? [],
    shopType: props.shopType,
    onShopTypeChange: props.onShopTypeChange,
    onCreateShop: props.onCreateShop,
    onDeleteItem: props.onDeleteShop
  };

  return (
    <div className='cards'>
      {cards.map(card => cardContentVisible(card.id) && (
        <div className={`card ${cardStates.find(c => c.id === card.id).collapsed ? 'collapsed' : ''}`} key={card.id}>
          <div className='card-side-div card-expand-div'>
            <h3 className='card-title'>{cardTitle(card.id, card.title)}</h3>
            <button className='collapse-button' onClick={() => toggleCard(card.id)}>
              <span className='material-symbols-outlined'>
                {!cardStates.find(c => c.id === card.id).collapsed ?
                  ('expand_less') : ('expand_more')
                }
              </span>
            </button>
          </div>
          {!cardStates.find(c => c.id === card.id).collapsed && (
            <div className='card-content'>
              {card.id === 1 && <MenuCardWorld props={menuCardWorldProps} />}
              {card.id === 2 && <MenuCardCity props={menuCardCityProps} />}
              {card.id === 3 && <MenuCardShop props={menuCardShopProps} />}
            </div>
          )}
        </div>
      ))}
    </div>
  );

}

export default MenuCards;
