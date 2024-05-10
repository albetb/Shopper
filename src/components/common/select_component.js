import React from 'react';
import '../../style/menu_cards.css';

const SelectComponent = ({ props }) => {
  const handleNewClick = () => {
    props.setIsVisible(true);
  };

  const handleDropdownChange = (event) => {
    props.onSelect(event.target.value);
  };

  return (
    <>
      <div className='card-side-div'>
        <select
          className='modern-dropdown'
          onChange={handleDropdownChange}
          value={props.saved[0]}
          disabled={props.saved.length === 0} // Disable the dropdown if it has zero elements
        >
          {props.saved.length > 0 ? (
            props.saved.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))
          ) : (
            <option value='' disabled>
              Create a {props.tabName}
            </option>
          )}
        </select>
        <button className='modern-button' onClick={handleNewClick}>
          New {props.tabName}
        </button>
      </div>
    </>
  );
};

export default SelectComponent;
