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
            <th className='numberSize'>#</th>
            <th className='nameSize'>Name</th>
            <th className='typeSize'>Type</th>
            <th className='costSize'>Cost</th>
          </tr>
        </thead>
        <tbody>
          {items && items.map((item, index) => (
            <tr key={index}>
              <td>{item.number}</td>
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
              <td>{item.Cost} gp</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ShopInventory;