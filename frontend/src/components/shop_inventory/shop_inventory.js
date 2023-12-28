import React, { useState } from 'react';
import { trimLine, isMobile, itemTypes } from '../../lib/utils';
import '../../style/shop_inventory.css';

const AddItemForm = ({ onAddItem, setShowAddItemForm }) => {
  const [number, setNumber] = useState(1);
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState('Good');
  const [cost, setCost] = useState(1);

  const handleAddItemClick = () => {
    // Call the onAddItem function with the details of the new item
    onAddItem(number, itemName, itemType, cost);
    // Reset form fields
    setNumber(1);
    setItemName('');
    setItemType('Good');
    setCost(1);
    setShowAddItemForm(false);
  };

  return (
    <tr className='add-item'>
      <td className='number-size'>
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className='number-size modern-input'
        />
      </td>
      <td className='name-size'>
        <input
          type="text"
          placeholder="Item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className='name-size modern-input'
        />
      </td>
      <td className='type-size'>
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
      <td className='cost-size'>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className='cost-size modern-input'
        />
      </td>
      <td className='action-size'>
        <button className='item-number-button' onClick={handleAddItemClick}>
          +
        </button>
      </td>
    </tr>
  );
};

const ShopInventory = ({ items, shopName, cityName, onDeleteItem, onAddItem }) => {
  const [showAddItemForm, setShowAddItemForm] = useState(false);

  if (!items || !items.some(item => item.Number > 0)) {
    return null; // If there are no items or all items have number <= 0, do not display anything
  }

  const shopLabel = () => {
    const trimLength = isMobile() ? 20 : 30;
    return `${trimLine(shopName, trimLength)}`;
  };

  const cityLabel = () => {
    const trimLength = isMobile() ? 26 : 40;
    return `${cityName && "from "}${trimLine(cityName, trimLength)}`;
  };

  const abbreviateLabel = (itemName) => {
    // Check if the itemName is "Wondrous Item" and abbreviate accordingly
    return isMobile() && itemName === "Wondrous Item" ? "W. Item" : itemName;
  };

  const handleDeleteItemClick = (itemName, itemType) => {
    onDeleteItem(itemName, itemType);
  };

  const handleAddItemButtonClick = () => {
    setShowAddItemForm(true);
  };

  return (
    <>
      <h2>{shopLabel()}</h2>
      <p>{cityLabel()}</p>
      <table>
        <thead>
          <tr>
            <th className='number-size'>#</th>
            <th className='name-size'>Name</th>
            <th className='type-size'>Type</th>
            <th className='cost-size'>Cost</th>
            <th className='action-size'></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            // Conditionally render a row only if item.number is more than zero
            item.Number > 0 && (
              <tr key={index}>
                <td className='align-right'>{item.Number}</td>
                <td>
                  {item.Link ? (
                    <a href={item.Link} target="_blank" rel="noopener noreferrer">
                      {item.Name}
                    </a>
                  ) : (
                    item.Name
                  )}
                </td>
                <td>{abbreviateLabel(item.ItemType)}</td>
                <td>{item.Cost}</td>
                <td>
                  <button className='item-number-button' onClick={() => handleDeleteItemClick(item.Name, item.ItemType)}>
                    -
                  </button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
      {showAddItemForm ? (
        <AddItemForm onAddItem={onAddItem} setShowAddItemForm={setShowAddItemForm} />
      ) : (
        <button className='add-item-button' onClick={handleAddItemButtonClick}>
          Add Item
        </button>
      )}
    </>
  );
};

export default ShopInventory;
