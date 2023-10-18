import React, { useState } from 'react';
import '../../style/menu_cards.css';

const MenuCardCity = ({ props }) => {
  const [isNewCityVisible, setIsNewCityVisible] = useState(false);
  const [cityName, setCityName] = useState('');

  const handleNewCityClick = () => {
    setIsNewCityVisible(true);
  };

  const handleOkClick = () => {
    props.onNewCity(cityName)
    setIsNewCityVisible(false);
    setCityName('');
  };

  const handleDropdownChange = (event) => {
    props.onSelectCity(event.target.value);
  };

  return (
          <>
              {isNewCityVisible ? (
                <>
                  <div className="card-side-div">
                    <input className="modern-dropdown"
                      type="text"
                      placeholder="Insert new city name"
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                      />
                    <button className="modern-button" onClick={handleOkClick}>Ok</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="card-side-div">
                    <select className="modern-dropdown" onChange={handleDropdownChange} value={props.savedCities[0]}>
                      {props.savedCities.length > 0 ? (
                        props.savedCities.map((city, index) => (
                          <option key={index} value={city}>
                            {city}
                          </option>
                        ))
                      ) : (
                        <option value="">Create a city</option>
                      )}
                    </select>
                    <button className="modern-button" onClick={handleNewCityClick}>New city</button>
                  </div>
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
