import React, { useState } from 'react';
import LevelComponent from '../common/level_component';
import SelectComponent from '../common/select_component';
import CreateComponent from '../common/create_component';
import '../../style/menu_cards.css';

const MenuCardWorld = ({ props }) => {
  const [isNewWorldVisible, setIsNewWorldVisible] = useState(false);
  const [buttonTextCustom, setButtonTextCustom] = useState(<span className='material-symbols-outlined'>fast_forward</span>);
  const [isTransitioningCustom, setIsTransitioningCustom] = useState(false);
  const [hours, setHours] = useState('');
  const [days, setDays] = useState('');

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
    onSelect: props.onSelectWorld,
    onDeleteItem: props.onDeleteItem
  };

  const levelComponentProps = {
    level: props.playerLevel,
    levelName: 'Player Level',
    onLevelChange: props.onPlayerLevelChange
  };

  const handleHoursBlur = () => {
    const hoursValue = hours ? parseInt(hours, 10) : 0;
    if (hoursValue < 0) {
      setHours('0');
    } else if (hoursValue > 23) {
      setHours('23');
    }
    else {
      setHours(hoursValue.toString());
    }
  };

  const handleDaysBlur = () => {
    const daysValue = days ? parseInt(days, 10) : 0;
    if (daysValue < 0) {
      setDays('0');
    } else if (daysValue > 7) {
      setDays('7');
    }
    else {
      setDays(daysValue.toString());
    }
  };

  const handleCustomWait = () => {
    if (hours || days) {
      setIsTransitioningCustom(true);
      setTimeout(() => {
        setButtonTextCustom(<span className='material-symbols-outlined'>check</span>);
        setIsTransitioningCustom(false);
        setTimeout(() => setButtonTextCustom(<span className='material-symbols-outlined'>fast_forward</span>), 1000);
      }, 300);
      const hoursValue = hours ? parseInt(hours, 10) : 0;
      const daysValue = days ? parseInt(days, 10) : 0;
      props.onWaitTime(hoursValue, daysValue);
    }
  };

  return (
    <>
      {isNewWorldVisible ? (
        <CreateComponent props={createComponentProps} />
      ) : (
        <>
          <SelectComponent props={selectComponentProps} />
          {props.savedWorlds.length > 0 && (
            <>
              <LevelComponent props={levelComponentProps} />

              <div className={`card-side-div margin-top ${props.isShopGenerated ? '' : 'opacity-50'}`}>
                <input
                  type='number'
                  placeholder='hours'
                  value={hours}
                  min={0}
                  max={23}
                  onChange={(e) => setHours(e.target.value)}
                  onBlur={handleHoursBlur}
                  className='modern-dropdown small padding-left'
                  disabled={!props.isShopGenerated}
                />
                <input
                  type='number'
                  placeholder='days'
                  value={days}
                  min={0}
                  max={7}
                  onChange={(e) => setDays(e.target.value)}
                  onBlur={handleDaysBlur}
                  className='modern-dropdown small padding-left'
                  disabled={!props.isShopGenerated}
                />
                <button
                  onClick={handleCustomWait}
                  className={`modern-dropdown small ${isTransitioningCustom ? 'transition' : ''}`}
                  disabled={!props.isShopGenerated}
                >
                  {buttonTextCustom}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default MenuCardWorld;
