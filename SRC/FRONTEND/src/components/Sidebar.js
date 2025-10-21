// components/Sidebar.js
import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

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

const SidebarTitle = styled.h2`
  color: white;
  font-size: 24px;
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const SidebarNav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

// troque styled.a por styled(NavLink)
const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  color: #d1d5db;
  text-decoration: none;
  border-radius: 10px;
  margin-bottom: 6px;
  transition: all 0.3s ease;
  background: transparent;

  &.active {
    background: #3b82f6;
    color: white;
  }

  &:hover {
    background: #374151;
    color: white;
  }
`;

const NavIcon = styled.span`
  margin-right: 14px;
  width: 22px;
  text-align: center;
  font-size: 19px;
`;

const NavDivider = styled.div`
  height: 1px;
  background: #374151;
  margin: 25px 0;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  margin: 25px 20px;
  padding: 14px 16px;
  color: #d1d5db;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  border-radius: 10px;

  &:hover {
    background: #ef4444;
    color: white;
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarTitle>PicMoney</SidebarTitle>
      </SidebarHeader>

      <SidebarNav>
        <NavItem to="/reports">
          <NavIcon>📊</NavIcon>
          <span>Relatórios</span>
        </NavItem>

        <NavItem to="/settings">
          <NavIcon>⚙️</NavIcon>
          <span>Configurações</span>
        </NavItem>

        <NavItem to="/login">
          <NavIcon>🔐</NavIcon>
          <span>Login</span>
        </NavItem>

        <NavDivider />
      </SidebarNav>

      <LogoutButton>
        <NavIcon>🚪</NavIcon>
        <span>Sair</span>
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;
