import React, { useState } from 'react';
import { trimLine, isMobile, itemTypes } from '../../lib/utils';
import useLongPress from '../hooks/useLongPress';
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
      <td className='number-size'>
        <input
          type='number'
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className='number-size modern-input'
        />
      </td>
      <td className='name-size name-small'>
        <input
          type='text'
          placeholder='Item name'
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
          type='number'
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className='cost-size modern-input'
        />
      </td>
      <td className='action-size'>
        <button className='item-number-button' onClick={handleAddItemClick}>
          <span className='material-symbols-outlined'>
            add_shopping_cart
          </span>
        </button>
      </td>
    </tr>
  );
};

const ShopInventory = ({ props }) => {
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [deletingItems, setDeletingItems] = useState({});

  const handleDeleteItemClick = (itemName, itemType) => {
    const itemKey = `${itemName}-${itemType}`;
    setDeletingItems((prev) => ({ ...prev, [itemKey]: true }));

    setTimeout(() => {
      props.onDeleteItem(itemName, itemType);
      setDeletingItems((prev) => {
        const newDeletingItems = { ...prev };
        delete newDeletingItems[itemKey];
        return newDeletingItems;
      });
    }, 300);
  };

  const handleAddItemButtonClick = () => {
    setShowAddItemForm(true);
  };

  const longPressEvent = useLongPress(
    (itemName, itemType) => handleDeleteItemClick(itemName, itemType),
    () => { },
    { shouldPreventDefault: true, delay: 500 }
  );

  if (!props.items || !props.items.some(item => item.Number > 0)) {
    return null;
  }

  const shopLabel = () => {
    const trimLength = isMobile() ? 20 : 30;
    return `${trimLine(props.shopName, trimLength)}`;
  };

  const cityLabel = () => {
    const trimLength = isMobile() ? 26 : 40;
    return `${props.cityName && 'from '}${trimLine(props.cityName, trimLength)}`;
  };

  const abbreviateLabel = (itemName) => {
    return isMobile() && itemName === 'Wondrous Item' ? 'W. Item' : itemName;
  };

  return (
    <>
      <div className='header-container'>
        <div className='label-container'>
          <h2>{shopLabel()}</h2>
          <div className='space-left'>
            <p>{cityLabel()}</p>
          </div>
        </div>
        <div className='money-box'>
          <p><b>Gold: {typeof (parseFloat(props.gold)) === 'number' ? parseFloat(props.gold) : '0'}</b></p>
        </div>
      </div>
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
          {props.items.map((item, index) => {
            const itemKey = `${item.Name}-${item.ItemType}`;
            return (
              item.Number > 0 && (
                <tr key={index} className={deletingItems[itemKey] ? 'deleting' : ''}>
                  <td className='align-right'>{item.Number}</td>
                  <td>
                    {item.Link ? (
                      <a href={item.Link} target='_blank' rel='noopener noreferrer'>
                        {item.Name}
                      </a>
                    ) : (
                      item.Name
                    )}
                  </td>
                  <td>{abbreviateLabel(item.ItemType)}</td>
                  <td>{item.Cost}</td>
                  <td>
                    <button
                      className='item-number-button'
                      onMouseDown={(e) => longPressEvent.onMouseDown(e, [item.Name, item.ItemType])}
                      onTouchStart={(e) => longPressEvent.onTouchStart(e, [item.Name, item.ItemType])}
                      onMouseUp={longPressEvent.onMouseUp}
                      onMouseLeave={longPressEvent.onMouseLeave}
                      onTouchEnd={longPressEvent.onTouchEnd}
                    >
                      <span className='material-symbols-outlined'>
                        remove_shopping_cart
                      </span>
                    </button>
                  </td>
                </tr>
              )
            );
          })}
        </tbody>
      </table>
      {showAddItemForm ? (
        <AddItemForm onAddItem={props.onAddItem} setShowAddItemForm={setShowAddItemForm} />
      ) : (
        <button className='add-item-button' onClick={handleAddItemButtonClick}>
          Add Item
        </button>
      )}
    </>
  );
};

export default ShopInventory;
