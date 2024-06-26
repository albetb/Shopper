import React, { useState, useEffect, useRef } from 'react';
import '../../style/menu_cards.css';

const SelectComponent = ({ props }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setConfirmDelete(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleNewClick = () => {
    props.setIsVisible(true);
  };

  const handleDropdownChange = (event) => {
    props.onSelect(event.target.value);
  };

  const handleDropdownClick = () => {
    setConfirmDelete(false);
  };

  const handleDelete = () => {
    props.onDeleteItem();
    setConfirmDelete(false);
  };

  const handleConfirmClick = () => {
    setConfirmDelete(true);
  };

  const handleCancelClick = () => {
    setConfirmDelete(false);
  };

  const isSavedEmpty = !Array.isArray(props.saved) || props.saved.length === 0;

  return (
    <div ref={selectRef} className='card-side-div'>
      {!isSavedEmpty && (
        <>
          <select
            className='modern-dropdown'
            onChange={handleDropdownChange}
            onClick={handleDropdownClick}
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

      {!confirmDelete && (
        <button className={isSavedEmpty ? 'modern-button' : 'levels-button large'} onClick={handleNewClick}>
          <span className="material-symbols-outlined">
            new_window
          </span>
        </button>
      )}

      {!isSavedEmpty && (
        <>
          {confirmDelete ? (
            <>
              <button className='levels-button large' onClick={handleDelete}>
                <span className="material-symbols-outlined">
                  delete
                </span>
              </button>
              <button className='levels-button large' onClick={handleCancelClick}>
                <span className="material-symbols-outlined">
                  close
                </span>
              </button>
            </>
          ) : (
            <button className='levels-button large' onClick={handleConfirmClick}>
              <span className="material-symbols-outlined">
                delete
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default SelectComponent;
