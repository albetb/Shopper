import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../style/shop_inventory.css';
import { setStateCurrentTab } from '../../store/slices/appSlice';
import { isMobile } from '../../lib/utils';

export default function MainPage() {
  const dispatch = useDispatch();
  const [showAddItemForm, setShowAddItemForm] = useState(false);

  const handleShopClick = () => dispatch(setStateCurrentTab(1));;
  const handleSpellbookClick = () => dispatch(setStateCurrentTab(2));

  const shopButton =
    <button
      className={`modern-dropdown small`}
      onClick={handleShopClick}
      title="Shop generator"
    >
      <span className="material-symbols-outlined">shopping_cart</span>
    </button>

  const spellbookButton =
    <button
      className={`modern-dropdown small`}
      onClick={handleSpellbookClick}
      title="Spellbook"
    >
      <span className="material-symbols-outlined">menu_book</span>
    </button>


  const buttons = (
    <>
      <div className="menu-side-by-side">
        <p style={{ textShadow: "1px 1px #12121366" }}>Shop generator</p>
        {shopButton}
      </div>
      <div className="menu-side-by-side">
        <p style={{ textShadow: "1px 1px #12121366" }}>Spellbook</p>
        {spellbookButton}
      </div>
    </>
  );

  const isMobileNow = isMobile();
  const ww = isMobileNow ? "80%" : "20%";
  const plr = isMobileNow ? "5%" : "3%";
  const pp = isMobileNow ? "2%" : "1%";

  return (
    <>
      <h1>Welcome to Shopperino!</h1>
      <p style={{ color: "#d5d5d5", width: "90%", textAlign: "center" }}>A collection of tools for Dungeons and Dragons 3.5</p>
      <div className="card" style={{ width: ww, padding: pp, paddingLeft: plr, paddingRight: plr }}>
      <div className="menu-side-by-side">
        <p style={{ textShadow: "1px 1px #12121366" }}>Shop generator</p>
        {shopButton}
      </div>
        <p style={{ textAlign: "center" }}>Generates randomized shops whose inventory dynamically scales to the player’s level.</p>
      </div>
      <div className="card" style={{ width: ww, padding: pp, paddingLeft: plr, paddingRight: plr }}>
      <div className="menu-side-by-side">
        <p style={{ textShadow: "1px 1px #12121366" }}>Spellbook</p>
        {spellbookButton}
      </div>
        <p style={{ textAlign: "center" }}>An spellbook that lets players organize and track their learned spells.</p>
      </div>
    </>
  );
}
