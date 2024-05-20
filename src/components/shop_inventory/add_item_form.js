import React, { useState } from 'react';
import { itemTypes } from '../../lib/utils';
import '../../style/shop_inventory.css';

const AddItemForm = ({ onAddItem, setShowAddItemForm }) => {
  const [number, setNumber] = useState(1);
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState('Good');
  const [cost, setCost] = useState(1);

  const handleAddItemClick = () => {
    onAddItem(itemName, itemType, cost, number);
    setNumber(1);
    setItemName('');
    setItemType('Good');
    setCost(1);
    setShowAddItemForm(false);
  };

  return (
    <tr className='add-item'>
      <td className='number-size no-border-top'>
        <input
          type='number'
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className='number-size modern-input'
        />
      </td>
      <td className='name-size name-small no-border-top'>
        <input
          type='text'
          placeholder='Item name'
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className='name-size modern-input'
        />
      </td>
      <td className='type-size no-border-top'>
        <select
          value={itemType}
          onChange={(e) => setItemType(e.target.value)}
          className='type-size modern-input'
        >
          {itemTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </td>
      <td className='cost-size no-border-top'>
        <input
          type='number'
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className='cost-size modern-input'
        />
      </td>
      <td className='action-size no-border-top'>
        <button className='item-number-button' onClick={handleAddItemClick}>
          <span className='material-symbols-outlined'>
            add_shopping_cart
          </span>
        </button>
      </td>
    </tr>
  );
};

export default AddItemForm;
