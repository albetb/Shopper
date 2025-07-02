import { useDispatch, useSelector } from 'react-redux';
import InfoMenuCards from '../menu_cards/info_menu_cards';
import { toggleInfoSidebar, clearInfoCards, removeCard } from '../../store/slices/appSlice';
import '../../style/sidebar.css';
import { isMobile } from '../../lib/utils';

export default function InfoSidebar() {
  const dispatch = useDispatch();
  const isCollapsed = useSelector(state => state.app.infoSidebarCollapsed);
  const otherBarIsCollapsed = useSelector(state => state.app.sidebarCollapsed);
  const cardsData = useSelector(state => state.app.infoCards);

  const handleToggle = () => dispatch(toggleInfoSidebar());
  const handleClearInfoCards = () => dispatch(clearInfoCards());
  const handleCloseCard = (card) => dispatch(removeCard(card));

  if (cardsData.length === 0
    || (isMobile() && !otherBarIsCollapsed)) return null;

  return (
    <div className={`info-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="info-toggle-button" onClick={handleToggle}>
        <span className="material-symbols-outlined">
          {isCollapsed ? 'app_registration' : 'arrow_forward_ios'}
        </span>
      </button>

      {!isCollapsed && (
        <>
          <button className="saving-button delete-info-button" onClick={handleClearInfoCards}>
            <span className="material-symbols-outlined">delete</span>
          </button>

          <InfoMenuCards cardsData={cardsData} closeCard={handleCloseCard} />
        </>
      )}
    </div>
  );
}
