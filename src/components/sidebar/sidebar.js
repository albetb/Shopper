import { useSelector, useDispatch } from 'react-redux';
import MenuCards from '../menu_cards/menu_cards';
import { handleFileUpload, downloadLocalStorage } from '../../lib/storage';
import { toggleSidebar } from '../../store/appSlice';
import '../../style/sidebar.css';

export default function Sidebar() {
  const dispatch = useDispatch();
  const isCollapsed = useSelector(state => state.app.sidebarCollapsed);

  const handleToggle = () => dispatch(toggleSidebar());
  const handleUploadClick = () => document.getElementById('upload').click();

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>      
      <button className="toggle-button" onClick={handleToggle}>
        <span className="material-symbols-outlined">
          {isCollapsed ? 'arrow_forward' : 'arrow_back'}
        </span>
      </button>

      {!isCollapsed && (
        <>
          <button className="saving-button" onClick={downloadLocalStorage}>
            <span className="material-symbols-outlined">download</span>
          </button>

          <input
            type="file"
            id="upload"
            style={{ display: 'none' }}
            accept="application/json"
            onChange={handleFileUpload}
          />
          <button
            className="saving-button saving-button-margin"
            onClick={handleUploadClick}
          >
            <span className="material-symbols-outlined">drive_folder_upload</span>
          </button>

          <MenuCards />
        </>
      )}
    </div>
  );
}
