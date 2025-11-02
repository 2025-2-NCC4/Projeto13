import React from 'react';
import styled from 'styled-components';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from './AuthContext';
import CfoDashboard from './pages/CFODashboard.js';


const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8fafc;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 35px;
  margin-left: ${p => (p.$authed ? '280px' : '0')};
  width: ${p => (p.$authed ? 'calc(100% - 280px)' : '100%')};
  background: #f8fafc;
  min-height: 100vh;

  @media (max-width: 768px) {
    margin-left: ${p => (p.$authed ? '70px' : '0')};
    width: ${p => (p.$authed ? 'calc(100% - 70px)' : '100%')};
    padding: 20px;
  }
`;

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <AppContainer>
      {isAuthenticated && <Sidebar />}
      <MainContent $authed={isAuthenticated}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/cfo" element={<ProtectedRoute><CfoDashboard/></ProtectedRoute>}/>
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </MainContent>
    </AppContainer>
  );
}