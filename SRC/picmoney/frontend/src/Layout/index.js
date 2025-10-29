import React from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from './MainContent';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <MainContent>
        {children}
      </MainContent>
    </div>
  );
};

export default Layout;