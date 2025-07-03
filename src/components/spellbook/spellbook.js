import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../style/shop_inventory.css';

export default function Spellbook() {
  const dispatch = useDispatch();
  const [showAddItemForm, setShowAddItemForm] = useState(false);

  return (
    <>
      <h1>Spellbook</h1>
      <p style={{ color: "#FEFEFE", width: "90%", textAlign: "center" }}>work in progress</p>
    </>
  );
}
