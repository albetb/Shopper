import React from 'react';
import MenuCards from '../menu_cards/menu_cards';
import '../../style/sidebar.css';

const Sidebar = ({ props }) => {
  return (
    <div>
      <div className={`sidebar ${props.isSidebarCollapsed ? 'collapsed' : ''}`}>

        <button className="toggle-button" onClick={props.toggleSidebar}>
          <span className="material-symbols-outlined">
            {!props.isSidebarCollapsed ?
            ( "arrow_back" ) : ( "arrow_forward" )}
          </span>
        </button>
        
        {!props.isSidebarCollapsed && (
          <div className="content">
            <MenuCards props={props}/>
          </div>
        )}
        
      </div>
      
    </div>
  );
};

export default Sidebar;
