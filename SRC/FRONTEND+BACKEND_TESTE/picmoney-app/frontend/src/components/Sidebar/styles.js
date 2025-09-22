import styled from 'styled-components';

export const SidebarContainer = styled.div`
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
  
  @media (max-width: 768px) {
    width: 70px;
    
    h2, span {
      display: none;
    }
  }
`;

export const SidebarHeader = styled.div`
  padding: 0 25px 20px;
  border-bottom: 1px solid #374151;
  margin-bottom: 25px;
`;

export const SidebarNav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

export const NavDivider = styled.div`
  height: 1px;
  background: #374151;
  margin: 25px 0;
`;

export const LogoutButton = styled.button`
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
  gap: 10px;

  &:hover {
    background: #ef4444;
    color: white;
  }
  
  @media (max-width: 768px) {
    justify-content: center;
    
    span:last-child {
      display: none;
    }
  }
`;