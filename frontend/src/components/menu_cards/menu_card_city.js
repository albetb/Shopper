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
            <div className="card-side-div">
              {isNewCityVisible ? (
                <>
                  <input className="modern-dropdown"
                    type="text"
                    placeholder="Insert new city name"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    />
                  <button className="modern-button" onClick={handleOkClick}>Ok</button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          );
};

export default MenuCardCity;
