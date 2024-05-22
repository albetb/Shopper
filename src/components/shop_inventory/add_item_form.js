import React, { useState, useEffect } from 'react';
import { itemTypes } from '../../lib/utils';
import { getItem } from '../../lib/item';
import '../../style/shop_inventory.css';

const AddItemForm = ({ onAddItem, items, setShowAddItemForm }) => {
  const [number, setNumber] = useState(1);
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState('Good');
  const [cost, setCost] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (itemName.length >= 2) {
      const filteredSuggestions = items.filter(item =>
        item.Name.toLowerCase().includes(itemName.toLowerCase())
      );
      const otherItems = getItem(itemName, itemType);

      setSuggestions([...filteredSuggestions, ...otherItems]);
    } else {
      setSuggestions([]);
    }
  }, [itemName, items]);

  const handleAddItemClick = () => {
    onAddItem(itemName, itemType, cost, number);
    setNumber(1);
    setItemName('');
    setItemType('Good');
    setCost(1);
    setShowAddItemForm(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setItemName(suggestion.Name);
    setItemType(suggestion.ItemType);
    setCost(suggestion.Cost);
    setSuggestions([]);
    setIsFocused(false);
  };

  const shouldShowSuggestions = isFocused && (suggestions.length > 1 ||
    (suggestions.length === 1 && suggestions[0].Name.toLowerCase() !== itemName.toLowerCase()));

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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className='name-size modern-input'
        />
        {shouldShowSuggestions && (
          <ul className='suggestions'>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onMouseDown={() => handleSuggestionClick(suggestion)}
                className='suggestion-item'
              >
                {suggestion.Name}
              </li>
            ))}
          </ul>
        )}
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
