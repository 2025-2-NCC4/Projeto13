import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';

const SidebarContainer = styled.div`
  width: 280px;
  background: #1f2937;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  padding: 25px 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  padding: 0 25px 20px;
  border-bottom: 1px solid #374151;
  margin-bottom: 25px;
`;

const SidebarNav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;



const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'reports', label: 'Relatórios', icon: '📈', path: '/reports' },
    { id: 'settings', label: 'Configurações', icon: '⚙️', path: '/settings' },
  ];

  return (
    <SidebarContainer>
      <SidebarHeader>
        <h2>PicMoney</h2>
      </SidebarHeader>
      
      <SidebarNav>
        {menuItems.map(item => (
          <SidebarItem
            key={item.id}
            item={item}
            active={location.pathname === item.path}
            to={item.path}
          />
        ))}
      </SidebarNav>
    
    </SidebarContainer>
  );
};

export default Sidebar;