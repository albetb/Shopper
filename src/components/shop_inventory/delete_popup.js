import React, { useState, useEffect, useRef } from 'react';
import '../../style/shop_inventory.css';

const DeletePopup = ({ itemName, itemType, itemNumber, onClose, onDelete, position }) => {
    const [num, setNum] = useState(itemNumber);
    const popupRef = useRef(null);

    const handleDelete = () => {
        onDelete(itemName, itemType, num);
        onClose();
    };

    const popupStyle = {
        top: `${parseInt((position.y + window.scrollY) / 6) * 6 - 95}px`,
        left: `${parseInt((position.x + window.scrollX) / 6) * 6 - 193}px`
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popupRef, onClose]);

    return (
        <div className='popup' style={popupStyle} ref={popupRef}>
            <div className='card-side-div width-90'>
                <input
                    type='range'
                    value={num}
                    onChange={(e) => setNum(e.target.value)}
                    min='0'
                    max={itemNumber}
                    className='modern-input small no-padding'
                />
                <div className='level-frame'>

                    <span>{num}</span>
                </div>
            </div>

            <div className='card-side-div margin-top width-90'>
                <button className='item-number-button small' onClick={handleDelete}>
                    <span className='material-symbols-outlined'>
                        remove_shopping_cart
                    </span>
                </button>

                <button className='item-number-button small' onClick={onClose}>
                    <span className='material-symbols-outlined'>
                        close
                    </span>
                </button>
            </div>
        </div>
    );
};

export default DeletePopup;
