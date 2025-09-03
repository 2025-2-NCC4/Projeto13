import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  margin: -20px -20px 20px -20px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  color: #2d3748;
  font-weight: 600;
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f56565;
    color: white;
  }
`;

const Header = ({ title = 'Dashboard' }) => {
  const { user, logout } = useAuth();

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <HeaderContainer>
      <PageTitle>{title}</PageTitle>
      
      <UserActions>
        <UserInfo>
          <UserAvatar>{getUserInitials()}</UserAvatar>
          <span>{user?.name || 'Usuário'}</span>
        </UserInfo>
        
        <LogoutButton onClick={logout}>
          Sair
        </LogoutButton>
      </UserActions>
    </HeaderContainer>
  );
};

export default Header;