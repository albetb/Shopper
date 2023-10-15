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
    if (cardId === 1){
      return true;
    }
    else if (cardId === 2){
      return props.savedWorlds && props.savedWorlds.length > 0;
    }
    else if (cardId === 3){
      return props.savedCities && props.savedCities.length > 0;
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
    savedCities: props.savedCities
  };

  var menuCardShopProps = {
    onSelectShop: props.onSelectShop,
    onNewShop: props.onNewShop,
    savedShops: props.savedShops
  };

  return (
          <div className="cards">
            {cards.map(card => cardContentVisible(card.id) && (
              <div className={`card ${cardStates.find(c => c.id === card.id).collapsed ? 'collapsed' : ''}`} key={card.id}>
                <div className="card-side-div card-expand-div">
                  <p className="card-title">{card.title}</p>
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
