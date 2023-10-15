import React, { useState } from 'react';
import MenuCards from '../menu_cards/menu_cards';
import '../../style/sidebar.css';

const Sidebar = ({ props }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div>
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>

        <button className="toggle-button" onClick={toggleSidebar}>
          <span className="material-symbols-outlined">
            {!isCollapsed ?
            ( "arrow_back" ) : ( "arrow_forward" )}
          </span>
        </button>
        
        {!isCollapsed && (
          <div className="content">
            <MenuCards props={props}/>
          </div>
        )}
        
      </div>
      
    </div>
  );
};

export default Sidebar;
