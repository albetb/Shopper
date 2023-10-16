import React, { useState } from 'react';
import MenuCardWorld from './menu_card_world';
import MenuCardCity from './menu_card_city';
import MenuCardShop from './menu_card_shop';
import '../../style/menu_cards.css';

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
    switch (cardId){
      case 1:
        const thereIsSavedWorld = props.savedWorlds && props.savedWorlds.length > 0;
        return `${cardTitle}${thereIsSavedWorld ? " - " : ""}${thereIsSavedWorld ? props.savedWorlds[0] : ""}${thereIsSavedWorld ? " - Lv:" : ""}${thereIsSavedWorld ? props.playerLevel : ""}`;
      case 2:
        const thereIsSavedCity = props.savedCities && props.savedCities.length > 0;
        return `${cardTitle}${thereIsSavedCity ? " - " : ""}${thereIsSavedCity ? props.savedCities[0] : ""}${thereIsSavedCity ? " - Lv:" : ""}${thereIsSavedCity ? props.cityLevel : ""}`;
      case 3:
        const thereIsSavedShop = props.savedShops && props.savedShops.length > 0;
        return `${cardTitle}${thereIsSavedShop ? " - " : ""}${thereIsSavedShop ? props.savedShops[0] : ""}${thereIsSavedShop ? " - Lv:" : ""}${thereIsSavedShop ? props.shopLevel : ""}`;
      default:
        return "";
    }
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
                  <p className="card-title">{cardTitle(card.id, card.title)}</p>
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
