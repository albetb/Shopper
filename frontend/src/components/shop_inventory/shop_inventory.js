import React from 'react';
import '../../style/shop_inventory.css';

const ShopInventory = ({ items, inventoryLabel }) => {
  if (items && items.length === 0) {
    return null; // If the items list is empty, do not display anything
  }

  return (
    <>
      <h2>{inventoryLabel}</h2>
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