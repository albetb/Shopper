import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Shop from '../../lib/shop';
import { isMobile, trimLine } from '../../lib/utils';
import { updateShop } from '../../store/slices/shopSlice';
import useLongPress from '../hooks/use_long_press';
import AddItemForm from './add_item_form';
import DeletePopup from './delete_popup';
import '../../style/shop_inventory.css';

export default function ShopInventory() {
  const dispatch = useDispatch();
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

  // --- Redux selectors ---
  const rawShop = useSelector(state => state.shop.shop);
  const items = rawShop ? new Shop().load(rawShop).getInventory() : [];
  const shopName = rawShop?.Name || '';
  const gold = rawShop?.Gold ?? 0;
  const cityName = useSelector(state => state.city.city?.Name) || '';

  // --- Handlers ---
  const handleDeleteItemClick = (e, name, type, number) => {
    if (!isLongPress) {
      const pos = e.changedTouches?.length
        ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
        : { x: e.clientX, y: e.clientY };
      setPopup({ visible: true, itemName: name, itemType: type, itemNumber: number, position: pos });
    }
  };

  const handleLongPressDelete = (name, type, number) => {
    setIsLongPress(true);
    const key = `${name}-${type}`;
    setDeletingItems(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      dispatch(updateShop(['sell', name, type, number]));
      setDeletingItems(prev => { const np = { ...prev }; delete np[key]; return np; });
      setIsLongPress(false);
    }, LONGPRESS_TIME);
  };

  const handleAddItem = (name, type, cost, number) => {
    dispatch(updateShop(['buy', name, type, cost, number]));
    setShowAddItemForm(false);
  };

  const longPressEvent = useLongPress(
    (_name, _type, number) => handleLongPressDelete(_name, _type, number),
    () => { },
    { shouldPreventDefault: true, delay: LONGPRESS_TIME }
  );

  // don’t render if no items at all
  if (!items.some(i => i.Number > 0)) return null;

  // --- Formatting ---
  const formatNumber = num => {
    const n = parseFloat(num);
    if (isNaN(n)) return '0';
    let [intPart, decPart] = n.toFixed(2).split('.');
    const sep = "'";
    const rev = intPart.split('').reverse().join('');
    const fmtInt = rev.match(/.{1,3}/g).join(sep).split('').reverse().join('');
    return `${fmtInt}.${decPart}`.replace('.00', '');
  };

  const shopLabel = () => trimLine(shopName, isMobile() ? 20 : 30);
  const cityLabel = () =>
    cityName
      ? `from ${trimLine(cityName, isMobile() ? 26 : 40)}`
      : '';

  return (
    <>
      <div className="header-container">
        <div className="label-container">
          <h2>{shopLabel()}</h2>
          <div className="space-left">
            <p>{cityLabel()}</p>
          </div>
        </div>
        <div className="money-box">
          <p><b>Gold: {formatNumber(gold)}</b></p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th className="number-size">#</th>
            <th className="name-size">Name</th>
            <th className="type-size">Type</th>
            <th className="cost-size">Cost</th>
            <th className="action-size"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => {
            if (item.Number <= 0) return null;
            const key = `${item.Name}-${item.ItemType}`;
            const abbrevType = isMobile() && item.ItemType === 'Wondrous Item'
              ? 'W. Item'
              : item.ItemType;

            return (
              <tr key={idx} className={deletingItems[key] ? 'deleting' : ''}>
                <td className="align-right">{item.Number}</td>
                <td>
                  {item.Link
                    ? <a href={item.Link} target="_blank" rel="noopener noreferrer">{item.Name}</a>
                    : item.Name
                  }
                </td>
                <td>{abbrevType}</td>
                <td>{formatNumber(item.Cost)}</td>
                <td>
                  <button
                    className="item-number-button"
                    onClick={e => handleDeleteItemClick(e, item.Name, item.ItemType, item.Number)}
                    onMouseDown={e => longPressEvent.onMouseDown(e, [item.Name, item.ItemType, item.Number])}
                    onTouchStart={e => longPressEvent.onTouchStart(e, [item.Name, item.ItemType, item.Number])}
                    onMouseUp={longPressEvent.onMouseUp}
                    onMouseLeave={longPressEvent.onMouseLeave}
                    onTouchEnd={e => {
                      longPressEvent.onTouchEnd(e);
                      handleDeleteItemClick(e, item.Name, item.ItemType, item.Number);
                    }}
                  >
                    <span className="material-symbols-outlined">remove_shopping_cart</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showAddItemForm
        ? <AddItemForm onAddItem={handleAddItem} items={items} setShowAddItemForm={setShowAddItemForm} />
        : <button className="add-item-button" onClick={() => setShowAddItemForm(true)}>Add Item</button>
      }

      {popup.visible && (
        <DeletePopup
          itemName={popup.itemName}
          itemType={popup.itemType}
          itemNumber={popup.itemNumber}
          position={popup.position}
          onClose={() => setPopup({ ...popup, visible: false })}
          onDelete={() => {
            dispatch(updateShop(['sell', popup.itemName, popup.itemType, popup.itemNumber]));
            setPopup({ ...popup, visible: false });
          }}
        />
      )}
    </>
  );
}
