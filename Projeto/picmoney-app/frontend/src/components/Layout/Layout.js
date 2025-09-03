import React from 'react';
import styled from 'styled-components';
import Sidebar from '../Sidebar/Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  overflow-x: hidden; /* Impede scroll horizontal */
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 280px;
  background: #f5f7f9;
  min-width: 0; /* Permite que o conteúdo se ajuste */
  width: calc(100% - 280px); /* Calcula a largura correta */
`;

const ContentWrapper = styled.div`
  padding-top: 70px;
  width: 100%;
  box-sizing: border-box; /* Inclui padding na largura total */
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;