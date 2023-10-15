import React, { useState } from 'react';
import '../../style/menu_cards.css';

const MenuCardWorld = ({ props }) => {  
  const [isNewWorldVisible, setIsNewWorldVisible] = useState(false);
  const [worldName, setWorldName] = useState('');
  
  const handleNewWorldClick = () => {
    setIsNewWorldVisible(true);
  };

  const handleOkClick = () => {
    props.onNewWorld(worldName)
    setIsNewWorldVisible(false);
    setWorldName('');
  };
  
  const handleDropdownChange = (event) => {
    props.onSelectWorld(event.target.value);
  };

  return (
          <div className="card-side-div">
            {isNewWorldVisible ? (
              <>
                <input className="modern-dropdown"
                  type="text"
                  placeholder="Insert new world name"
                  value={worldName}
                  onChange={(e) => setWorldName(e.target.value)}
                  />
                <button className="modern-button" onClick={handleOkClick}>Ok</button>
              </>
            ) : (
              <>
                <select className="modern-dropdown" onChange={handleDropdownChange} value={props.savedWorlds[0]}>
                  {props.savedWorlds.length > 0 ? (
                    props.savedWorlds.map((world, index) => (
                      <option key={index} value={world}>
                        {world}
                      </option>
                    ))
                  ) : (
                    <option value="">Create a world</option>
                  )}
                </select>
                <button className="modern-button" onClick={handleNewWorldClick}>New world</button>
              </>
            )}
          </div>
        );
}

export default MenuCardWorld;
