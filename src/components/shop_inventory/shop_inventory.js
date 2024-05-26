import React, { useState, useEffect, useRef } from 'react';
import { trimLine, isMobile } from '../../lib/utils';
import useLongPress from '../hooks/use_long_press';
import AddItemForm from './add_item_form';
import DeletePopup from './delete_popup';
import '../../style/shop_inventory.css';

const ShopInventory = ({ props }) => {
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [deletingItems, setDeletingItems] = useState({});
  const [popup, setPopup] = useState({
    visible: false,
    itemName: '',
    itemType: '',
    itemNumber: 0,
    position: { x: 0, y: 0 }
  });
  const [isLongPress, setIsLongPress] = useState(false);

  const LONGPRESS_TIME = 400;

  const handleDeleteItemClick = (event, itemName, itemType, itemNumber) => {
    if (!isLongPress) {
      const clickPosition = event.changedTouches?.length > 0
        ? { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }
        : { x: event.clientX, y: event.clientY };

      setPopup({
        visible: true,
        itemName,
        itemType,
        itemNumber,
        position: clickPosition
      });
    }
  };

  const handleLongPressDelete = (itemName, itemType) => {
    setIsLongPress(true);
    const itemKey = `${itemName}-${itemType}`;
    setDeletingItems((prev) => ({ ...prev, [itemKey]: true }));

    setTimeout(() => {
      props.onDeleteItem(itemName, itemType);
      setDeletingItems((prev) => {
        const newDeletingItems = { ...prev };
        delete newDeletingItems[itemKey];
        return newDeletingItems;
      });
      setIsLongPress(false);
    }, LONGPRESS_TIME);
  };

  const handleAddItemButtonClick = () => {
    setShowAddItemForm(true);
  };

  const longPressEvent = useLongPress(
    (itemName, itemType) => handleLongPressDelete(itemName, itemType),
    () => { },
    { shouldPreventDefault: true, delay: LONGPRESS_TIME }
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

  function formatGold() {
    return formatNumber(props.gold);
  }

  function formatNumber(num) {
    if (typeof parseFloat(num) !== 'number' || isNaN(num)) {
      return '0';
    }
    const separator = "'";
    let [integerPart, decimalPart] = num.toFixed(2).split('.');
    let reversedIntegerPart = integerPart.split('').reverse().join('');
    let formattedIntegerPart = reversedIntegerPart.match(/.{1,3}/g).join(separator).split('').reverse().join('');

    return `${formattedIntegerPart}.${decimalPart}`.replace('.00', '');
  }

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
          <p><b>Gold: {formatGold()}</b></p>
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
                  <td>{formatNumber(item.Cost)}</td>
                  <td>
                    <button
                      className='item-number-button'
                      onClick={(e) => handleDeleteItemClick(e, item.Name, item.ItemType, item.Number)}
                      onMouseDown={(e) => longPressEvent.onMouseDown(e, [item.Name, item.ItemType])}
                      onTouchStart={(e) => longPressEvent.onTouchStart(e, [item.Name, item.ItemType])}
                      onMouseUp={longPressEvent.onMouseUp}
                      onMouseLeave={longPressEvent.onMouseLeave}
                      onTouchEnd={(e) => {
                        longPressEvent.onTouchEnd(e);
                        handleDeleteItemClick(e, item.Name, item.ItemType, item.Number);
                      }}
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
        <AddItemForm onAddItem={props.onAddItem} items={props.items} setShowAddItemForm={setShowAddItemForm} />
      ) : (
        <button className='add-item-button' onClick={handleAddItemButtonClick}>
          Add Item
        </button>
      )}
      {popup.visible && (
        <DeletePopup
          itemName={popup.itemName}
          itemType={popup.itemType}
          itemNumber={popup.itemNumber}
          position={popup.position}
          onClose={() => setPopup({ visible: false, itemName: '', itemType: '', itemNumber: 0, position: { x: 0, y: 0 } })}
          onDelete={(itemName, itemType, num) => props.onDeleteItem(itemName, itemType, num)}
        />
      )}
    </>
  );
};

export default ShopInventory;
