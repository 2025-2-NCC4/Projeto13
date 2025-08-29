import styled from 'styled-components';

export const SidebarContainer = styled.div`
  width: 250px;
  background: #2d3748;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  padding: 20px 0;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 70px;
    
    h2, span {
      display: none;
    }
  }
`;

export const SidebarHeader = styled.div`
  padding: 0 20px 20px;
  border-bottom: 1px solid #4a5568;
  margin-bottom: 20px;
`;

export const SidebarTitle = styled.h2`
  color: white;
  font-size: 20px;
  margin: 0;
`;

export const SidebarNav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 10px;
`;

export const NavItem = styled.a`
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: ${props => props.active ? 'white' : '#cbd5e0'};
  text-decoration: none;
  border-radius: 5px;
  margin-bottom: 5px;
  transition: all 0.3s ease;
  background: ${props => props.active ? '#4299e1' : 'transparent'};
  cursor: pointer;

  &:hover {
    background: #4a5568;
    color: white;
  }

  @media (max-width: 768px) {
    justify-content: center;
    padding: 15px;
  }
`;

export const NavIcon = styled.i`
  margin-right: 10px;
  width: 20px;
  text-align: center;

  @media (max-width: 768px) {
    margin-right: 0;
    font-size: 18px;
  }
`;

export const NavDivider = styled.div`
  height: 1px;
  background: #4a5568;
  margin: 15px 0;
`;

export const LogoutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  margin-top: auto;
  padding: 12px 15px;
  color: #cbd5e0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;

  &:hover {
    background: #e53e3e;
    color: white;
  }

  @media (max-width: 768px) {
    justify-content: center;
    
    span {
      display: none;
    }
  }
`;