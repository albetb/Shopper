import React, { useState } from 'react';
import LevelComponent from '../common/level_component';
import SelectComponent from '../common/select_component';
import CreateComponent from '../common/create_component';
import '../../style/menu_cards.css';

const MenuCardWorld = ({ props }) => {  
  const [isNewWorldVisible, setIsNewWorldVisible] = useState(false);
  
  const setIsVisible = (isVisible) => {
    setIsNewWorldVisible(isVisible);
  };
  
  const createComponentProps = {
    saved: props.savedWorlds,
    tabName: 'world',
    onNew: props.onNewWorld,
    setIsVisible: setIsVisible
  };
  
  const selectComponentProps = {
    saved: props.savedWorlds,
    tabName: 'world',
    setIsVisible: setIsVisible,
    onSelect: props.onSelectWorld
  };
  
    const levelComponentProps = {
      level: props.playerLevel,
      levelName: 'Player level',
      onLevelChange: props.onPlayerLevelChange
    };
  
  return (
          <>
            {isNewWorldVisible ? (
              <CreateComponent props={createComponentProps}/>
            ) : (
              <>
                <SelectComponent props={selectComponentProps}/>
                {props.savedWorlds.length > 0 && (
                  <LevelComponent props={levelComponentProps}/>
                )}
              </>
            )}
          </>
        );
}

export default MenuCardWorld;
