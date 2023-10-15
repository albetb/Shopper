import React from 'react';
import '../../style/shop_inventory.css';

const ShopInventory = ({ items }) => {
  if (items && items.length === 0) {
    return null; // If the items list is empty, do not display anything
  }

  return (
    <div>
      <h2>Shop Inventory</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Type</th>
            <th>Cost</th>
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
    </div>
  );
};

export default ShopInventory;