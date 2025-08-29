import React from 'react';
import { MainContentContainer, DashboardContent } from './MainContentStyles';

const MainContent = ({ children }) => {
  return (
    <MainContentContainer>
      <DashboardContent>
        {children}
      </DashboardContent>
    </MainContentContainer>
  );
};

export default MainContent;