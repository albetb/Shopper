import React, { useState } from 'react';
import { trimLine, isMobile } from '../../lib/utils';
import useLongPress from '../hooks/use_long_press';
import AddItemForm from './add_item_form';
import '../../style/shop_inventory.css';

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
