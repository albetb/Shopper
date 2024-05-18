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

  const isSavedEmpty = !Array.isArray(props.saved) || props.saved.length === 0;

  return (
    <div className='card-side-div'>
      {!isSavedEmpty && (
        <>
          <select
            className='modern-dropdown'
            onChange={handleDropdownChange}
            value={props.saved?.[0] || ''}
          >
            {props.saved.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </>
      )}

      <button className={isSavedEmpty ? 'modern-button' : 'levels-button'} onClick={handleNewClick}>
        <span className="material-symbols-outlined">
          new_window
        </span>
      </button>

      {!isSavedEmpty && (
        <>
          <button
            className='levels-button'
            {...longPressEvent}
          >
            <span className="material-symbols-outlined">
              delete
            </span>
          </button>
        </>
      )}
    </div>
  );
};

export default SelectComponent;
