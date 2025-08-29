import React, { useState } from 'react';
import styled from 'styled-components';

// Importe os componentes corretamente
import Sidebar from './components/Sidebar';
import Dashboard from './components/Login';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';

// Estilos globais
const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8fafc;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 35px;
  margin-left: 280px;
  width: calc(100% - 280px);
  background: #f8fafc;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    margin-left: 70px;
    width: calc(100% - 70px);
    padding: 20px;
  }
`;

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  // Função para renderizar a página correta
  const renderPage = () => {
    switch (activePage) {
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppContainer>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <MainContent>
        {renderPage()}
      </MainContent>
    </AppContainer>
  );
}

export default App;