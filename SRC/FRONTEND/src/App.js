// App.js
import React from 'react';
import styled from 'styled-components';
import { Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Login from './components/Login';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';

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

export default function App() {
  return (
    <AppContainer>
      <Sidebar />
      <MainContent>
        <Routes>
          {/* redireciona raiz para /reports (ajuste se preferir outra página inicial) */}
          <Route path="/" element={<Navigate to="/reports" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* 404 simples */}
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </MainContent>
    </AppContainer>
  );
}
