import React, { useState } from 'react';
import MenuCardWorld from './menu_card_world';
import MenuCardCity from './menu_card_city';
import MenuCardShop from './menu_card_shop';
import '../../style/menu_cards.css';
import { isMobile, trimLine } from '../../lib/utils';

const MenuCards = ({ props }) => {
  const [cardStates, setCardStates] = useState([
    { id: 1, collapsed: false },
    { id: 2, collapsed: false },
    { id: 3, collapsed: false }
  ]);

  const cards = [
    { id: 1, title: 'World' },
    { id: 2, title: 'City' },
    { id: 3, title: 'Shop' }
  ];

  const toggleCard = (cardId) => {
    setCardStates(prevStates => {
      return prevStates.map(cardState => {
        if (cardState.id === cardId) {
          return { ...cardState, collapsed: !cardState.collapsed };
        }
        return cardState;
      });
    });
  };

  const cardContentVisible = (cardId) => {
    switch (cardId){
      case 2:
        return props.savedWorlds && props.savedWorlds.length > 0;
      case 3:
        return props.savedCities && props.savedCities.length > 0;
      default:
        return true;
    }
  };

  const cardTitle = (cardId, cardTitle) => {
    let showText = false;
    let text = "";
    const trimLength = isMobile() ? 23 : 10;

    switch (cardId){
      case 1:
        showText = props.savedWorlds && props.savedWorlds.length > 0;
        text = showText ? ` - ${trimLine(props.savedWorlds[0], trimLength)} - Lv: ${props.playerLevel}` : "";
        break;
      case 2:
        showText = props.savedCities && props.savedCities.length > 0;
        text = showText ? ` - ${trimLine(props.savedCities[0], trimLength)} - Lv: ${props.cityLevel}` : "";
        break;
      case 3:
        showText = props.savedShops && props.savedShops.length > 0;
        text = showText ? ` - ${trimLine(props.savedShops[0], trimLength)} - Lv: ${props.shopLevel}` : "";
        break;
      default:
        break;
    }

    return `${cardTitle}${text}`;
  };

  var menuCardWorldProps = {
    onSelectWorld: props.onSelectWorld,
    onNewWorld: props.onNewWorld,
    savedWorlds: props.savedWorlds,
    playerLevel: props.playerLevel,
    onPlayerLevelChange: props.onPlayerLevelChange
  };

  var menuCardCityProps = {
    onSelectCity: props.onSelectCity,
    onNewCity: props.onNewCity,
    savedCities: props.savedCities,
    cityLevel: props.cityLevel,
    onCityLevelChange: props.onCityLevelChange
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
    selectedShopType: props.selectedShopType,
    onShopTypeChanged: props.onShopTypeChanged,
    onCreateShop: props.onCreateShop
  };

  return (
          <div className="cards">
            {cards.map(card => cardContentVisible(card.id) && (
              <div className={`card ${cardStates.find(c => c.id === card.id).collapsed ? 'collapsed' : ''}`} key={card.id}>
                <div className="card-side-div card-expand-div">
                  <h3 className="card-title">{cardTitle(card.id, card.title)}</h3>
                  <button className="collapse-button" onClick={() => toggleCard(card.id)}>
                    <span className="material-symbols-outlined">
                      {!cardStates.find(c => c.id === card.id).collapsed ? 
                        ( "expand_less" ) : ( "expand_more" )
                      }
                    </span>
                  </button>
                </div>
                {!cardStates.find(c => c.id === card.id).collapsed && (
                  <div className="card-content">
                    {card.id === 1 && <MenuCardWorld props={menuCardWorldProps}/>}
                    {card.id === 2 && <MenuCardCity props={menuCardCityProps}/>}
                    {card.id === 3 && <MenuCardShop props={menuCardShopProps}/>}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

}

export default MenuCards;
