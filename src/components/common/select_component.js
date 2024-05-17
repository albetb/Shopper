import React from 'react';
import useLongPress from '../hooks/useLongPress';
import '../../style/menu_cards.css';

const SelectComponent = ({ props }) => {
  const handleNewClick = () => {
    props.setIsVisible(true);
  };

  const handleDropdownChange = (event) => {
    props.onSelect(event.target.value);
  };

  const handleDelete = () => {
    props.onDeleteItem();
  };

  const longPressEvent = useLongPress(handleDelete, () => { }, { delay: 500 });

  return (
    <div className='card-side-div'>

      <select
        className='modern-dropdown'
        onChange={handleDropdownChange}
        value={props.saved?.[0] || ''}
        disabled={!Array.isArray(props.saved) || props.saved?.length === 0}
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

      <button className='levels-button' onClick={handleNewClick}>
        <span className="material-symbols-outlined">
          new_window
        </span>
      </button>

      <button
        className='levels-button'
        disabled={props.saved.length === 0}
        {...longPressEvent}
      >
        <span className="material-symbols-outlined">
          delete
        </span>
      </button>

    </div>
  );
};

export default SelectComponent;
