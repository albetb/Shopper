import React from 'react';
import { trimLine, isMobile } from '../../lib/utils';
import '../../style/shop_inventory.css';

const ShopInventory = ({ items, shopName, cityName }) => {
  if (items && items.length === 0) {
    return null; // If the items list is empty, do not display anything
  }
  
  const shopLabel = () => {
    const trimLength = isMobile() ? 20 : 30;
    return `${trimLine(shopName, trimLength)}`;
  };
  
  const cityLabel = () => {
    const trimLength = isMobile() ? 26 : 40;
    return `${cityName && "from "}${trimLine(cityName, trimLength)}`;
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
          </tr>
        </thead>
        <tbody>
          {items && items.map((item, index) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ShopInventory;