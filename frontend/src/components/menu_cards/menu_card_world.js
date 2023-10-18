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
  
  const handlePlayerLevelIncrement = () => {
    const level = parseInt(props.playerLevel);
    props.onPlayerLevelChange(level + 1);
  };
  
  const handlePlayerLevelDecrement = () => {
    const level = parseInt(props.playerLevel);
    props.onPlayerLevelChange(level - 1);
  };

  return (
          <>
              {isNewWorldVisible ? (
                <>
                  <div className="card-side-div">
                    <input className="modern-dropdown"
                      type="text"
                      placeholder="Insert new world name"
                      value={worldName}
                      onChange={(e) => setWorldName(e.target.value)}
                      />
                    <button className="modern-button" onClick={handleOkClick}>Ok</button>
                  </div>
              </>
              ) : (
                <>
                  <div className="card-side-div">
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
                  </div>
                    {props.savedWorlds.length > 0 && (
                      <>
                        <div className="card-side-div margin-top">
                          <label className="modern-label">Player Level:</label>
                          <div className='levels-div'>
                            <button className="levels-button" onClick={handlePlayerLevelDecrement}>-</button>
                              <div className='level-frame'> 
                                <label className="level-text">{props.playerLevel}</label>
                              </div>
                            <button className="levels-button" onClick={handlePlayerLevelIncrement}>+</button>
                          </div>
                        </div>
                      </>
                    )}
                </>
              )}
          </>
        );
}

export default MenuCardWorld;
