import React from 'react';
import MenuCards from '../menu_cards/menu_cards';
import { handleFileUpload, downloadLocalStorage } from '../../lib/storage'
import '../../style/sidebar.css';

const Sidebar = ({ props }) => {
  const handleUploadClick = () => {
    const fileInput = document.getElementById('upload');
    fileInput.click();
  };

  return (
    <div>
      <div className={`sidebar ${props.isSidebarCollapsed ? 'collapsed' : ''}`}>

        <button className='toggle-button' onClick={props.toggleSidebar}>
          <span className='material-symbols-outlined'>
            {!props.isSidebarCollapsed ?
              ('arrow_back') : ('arrow_forward')}
          </span>
        </button>

        {!props.isSidebarCollapsed && (
          <div className='content'>
            <div className='sidebar-buttons'>

              <button className='saving-button' onClick={downloadLocalStorage}>
                <span class="material-symbols-outlined">
                  download
                </span>
              </button>

              <input
                type='file'
                id='upload'
                style={{ display: 'none' }}
                accept='application/json'
                onChange={handleFileUpload}
              />
              <button className='saving-button saving-button-margin' onClick={handleUploadClick}>
                <span class="material-symbols-outlined">
                  drive_folder_upload
                </span>
              </button>

            </div>

            <MenuCards props={props} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
