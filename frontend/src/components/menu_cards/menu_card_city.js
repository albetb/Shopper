import React, { useState } from 'react';
import SelectComponent from '../common/select_component';
import CreateComponent from '../common/create_component';
import '../../style/menu_cards.css';

const MenuCardCity = ({ props }) => {
  const [isNewCityVisible, setIsNewCityVisible] = useState(false);
  
  const setIsVisible = (isVisible) => {
    setIsNewCityVisible(isVisible);
  };

  const createComponentProps = {
    saved: props.savedCities,
    tabName: "city",
    onNew: props.onNewCity,
    setIsVisible: setIsVisible
  };

  const selectComponentProps = {
    saved: props.savedCities,
    tabName: "city",
    setIsVisible: setIsVisible,
    onSelect: props.onSelectCity
  };

  return (
          <>
            {isNewCityVisible ? (
              <CreateComponent props={createComponentProps}/>
            ) : (
              <>
                <SelectComponent props={selectComponentProps}/>
                {props.savedCities.length > 0 && (
                  <>
                  <div className="card-side-div margin-top">
                    <label className="modern-label">City Level:</label>
                    <select
                      className="modern-dropdown"
                      value={props.cityLevel}
                      onChange={(e) => props.onCityLevelChange(e.target.value)}
                    >
                      <option value="1">Village</option>
                      <option value="2">Burg</option>
                      <option value="3">Town</option>
                      <option value="4">City</option>
                      <option value="5">Metropolis</option>
                    </select>
                  </div>
                </>
                )}
              </>
            )}
          </>
          );
};

export default MenuCardCity;
