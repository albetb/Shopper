import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ShopInventory from './components/shop_inventory/shop_inventory';
import ShopSidebar from './components/menus/shop_sidebar/shop_sidebar';
import * as db from './lib/storage';
import { serialize } from './lib/utils';
import {
  setStateCurrentTab
} from './store/slices/appSlice';
import {
  setCity
} from './store/slices/citySlice';
import {
  setShop,
  setShopGenerated
} from './store/slices/shopSlice';
import {
  setSelectedWorld,
  setWorld,
  setWorlds
} from './store/slices/worldSlice';
import TopMenu from './components/menus/top_menu';
import MainPage from './components/main_page/main_page';
import InfoSidebar from './components/menus/info_sidebar/info_sidebar';
import SpellbookSidebar from './components/menus/spellbook_sidebar/spellbook_sidebar';
import { setIsEditingSpellbook, setIsSpellTableCollapsed, setSelectedSpellbook, setSpellbook, setSpellbooks } from './store/slices/spellbookSlice';
import SpellbookTable from './components/spellbook/spellbook_table';
import './style/App.css';
import './style/buttons.css';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize localStorage/db
    db.validateDb();

    const worldsDb = db.getWorlds();
    const selW = db.getSelectedWorld();
    const w = db.getWorld(selW?.Id);
    const c = db.getCity(w?.SelectedCity?.Id);
    const s = db.getShop(c?.SelectedShop?.Id);
    const ct = db.getCurrentTab();
    const sbs = db.getSpellbooks();
    const ssb = db.getSelectedSpellbook();
    const sb = db.getSpellbook(ssb?.Id);
    const ie = db.getIsEditingSpellbook();
    const stc = db.getIsSpellTableCollapsed();

    // Populate Redux
    dispatch(setWorlds(worldsDb));
    dispatch(setSelectedWorld(selW));
    dispatch(setWorld(w));
    dispatch(setCity(c));
    dispatch(setShop(s));
    dispatch(setStateCurrentTab(ct));
    dispatch(setSpellbooks(sbs));
    dispatch(setSelectedSpellbook(ssb));
    dispatch(setSpellbook(sb));
    dispatch(setIsEditingSpellbook(ie));
    dispatch(setIsSpellTableCollapsed(stc));

    // Compute shopGenerated flag
    const generated = w?.Cities?.some(ci =>
      db.getCity(ci.Id).Shops.some(sh =>
        (db.getShop(sh.Id).getInventory() || []).length > 0
      )
    ) ?? false;
    dispatch(setShopGenerated(serialize(generated)));
  }, [dispatch]);

  const currentTab = useSelector(state => state.app.currentTab);

  const mainPage = <>
    <header className="app-header">
      <MainPage />
    </header>
  </>;

  const shopper = <>
    <ShopSidebar />
    <InfoSidebar />
    <header className="app-header">
      <ShopInventory />
    </header>
  </>;

  const spellbook = <>
    <SpellbookSidebar />
    <InfoSidebar />
    <header className="app-header">
      <SpellbookTable />
    </header>
  </>;

  const tabPages = {
    0: mainPage,
    1: shopper,
    2: spellbook
  };

  const currentTabContent = tabPages[currentTab] ?? mainPage;

  return (
    <div className="app">
      <TopMenu />
      {currentTabContent}
    </div>
  );
}
