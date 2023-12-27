import React from 'react';
import { trimLine, isMobile } from '../../lib/utils';
import '../../style/shop_inventory.css';

const ShopInventory = ({ items, shopName, cityName, onDeleteItem }) => {
  if (!items || !items.some(item => item.number > 0)) {
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

  const handleDeleteItemClick = (itemName, itemType) => {
    onDeleteItem(itemName, itemType);
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
            item.number > 0 && (
              <tr key={index}>
                <td className='align-right'>{item.number}</td>
                <td>
                  {item.Link ? (
                    <a href={item.Link} target="_blank" rel="noopener noreferrer">
                      {item.Name}
                    </a>
                  ) : (
                    item.Name
                  )}
                </td>
                <td>{item.itemType}</td>
                <td>{item.Cost}</td>
                <td>
                  <button className='levels-button' onClick={() => handleDeleteItemClick(item.Name, item.itemType)}>
                    -
                  </button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ShopInventory;
