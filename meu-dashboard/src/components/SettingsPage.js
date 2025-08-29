import React, { useState } from 'react';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f5f7f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const PageTitle = styled.h2`
  font-size: 28px;
  color: #2c3e50;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  
  button {
    background: none;
    border: none;
    color: #7f8c8d;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    
    &:hover {
      color: #e74c3c;
    }
  }
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SidebarMenu = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const MenuItem = styled.div`
  padding: 15px;
  margin: 8px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  color: ${props => props.active ? '#3498db' : '#7f8c8d'};
  background: ${props => props.active ? 'rgba(52, 152, 219, 0.1)' : 'transparent'};
  font-weight: ${props => props.active ? '600' : 'normal'};
  
  &:hover {
    background: rgba(52, 152, 219, 0.1);
  }
  
  i {
    margin-right: 10px;
    width: 20px;
    text-align: center;
  }
`;

const SettingsContent = styled.div`
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const Button = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.3s;
  
  &:hover {
    background: #2980b9;
  }
`;

const HistoryItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const HistoryDate = styled.div`
  color: #7f8c8d;
  font-size: 14px;
`;

const HistoryAction = styled.div`
  color: #2c3e50;
  font-weight: 500;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;
    
    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }
  
  input:checked + span {
    background-color: #2ecc71;
  }
  
  input:checked + span:before {
    transform: translateX(26px);
  }
`;

// Componente principal
const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('configuracoes');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  });

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const historyData = [
    { id: 1, action: 'Senha alterada', date: '12/06/2024 14:30' },
    { id: 2, action: 'Email verificado', date: '10/06/2024 09:15' },
    { id: 3, action: 'Login realizado', date: '05/06/2024 18:40' },
    { id: 4, action: 'Perfil atualizado', date: '01/06/2024 11:20' }
  ];

  return (
    <Container>
      <Header>
        <PageTitle>Configurações</PageTitle>
        <UserInfo>
          <button>
            <i className="fas fa-sign-out-alt"></i> Sair
          </button>
        </UserInfo>
      </Header>
      
      <ContentContainer>
        <SidebarMenu>
          <MenuItem 
            active={activeTab === 'configuracoes'} 
            onClick={() => setActiveTab('configuracoes')}
          >
            <i className="fas fa-cog"></i> Configurações
          </MenuItem>
          <MenuItem 
            active={activeTab === 'conta'} 
            onClick={() => setActiveTab('conta')}
          >
            <i className="fas fa-user"></i> Conta
          </MenuItem>
          <MenuItem 
            active={activeTab === 'senha'} 
            onClick={() => setActiveTab('senha')}
          >
            <i className="fas fa-lock"></i> Senha
          </MenuItem>
        </SidebarMenu>
        
        <SettingsContent>
          {activeTab === 'configuracoes' && (
            <>
              <SectionTitle>Notificações</SectionTitle>
              
              <CheckboxContainer>
                <ToggleSwitch>
                  <input 
                    type="checkbox" 
                    checked={notifications.email} 
                    onChange={() => handleNotificationChange('email')} 
                  />
                  <span></span>
                </ToggleSwitch>
                <Label>Notificações por Email</Label>
              </CheckboxContainer>
              
              <CheckboxContainer>
                <ToggleSwitch>
                  <input 
                    type="checkbox" 
                    checked={notifications.push} 
                    onChange={() => handleNotificationChange('push')} 
                  />
                  <span></span>
                </ToggleSwitch>
                <Label>Notificações Push</Label>
              </CheckboxContainer>
              
              <CheckboxContainer>
                <ToggleSwitch>
                  <input 
                    type="checkbox" 
                    checked={notifications.sms} 
                    onChange={() => handleNotificationChange('sms')} 
                  />
                  <span></span>
                </ToggleSwitch>
                <Label>Notificações por SMS</Label>
              </CheckboxContainer>
              
              <SectionTitle>Histórico</SectionTitle>
              {historyData.map(item => (
                <HistoryItem key={item.id}>
                  <HistoryAction>{item.action}</HistoryAction>
                  <HistoryDate>{item.date}</HistoryDate>
                </HistoryItem>
              ))}
            </>
          )}
          
          {activeTab === 'conta' && (
            <>
              <SectionTitle>Informações da Conta</SectionTitle>
              
              <FormGroup>
                <Label>Nome Completo</Label>
                <Input type="text" defaultValue="João Silva" />
              </FormGroup>
              
              <FormGroup>
                <Label>Email</Label>
                <Input type="email" defaultValue="joao.silva@exemplo.com" />
              </FormGroup>
              
              <FormGroup>
                <Label>Telefone</Label>
                <Input type="tel" defaultValue="(11) 99999-9999" />
              </FormGroup>
              
              <Button>Salvar Alterações</Button>
            </>
          )}
          
          {activeTab === 'senha' && (
            <>
              <SectionTitle>Alterar Senha</SectionTitle>
              
              <FormGroup>
                <Label>Senha Atual</Label>
                <Input type="password" />
              </FormGroup>
              
              <FormGroup>
                <Label>Nova Senha</Label>
                <Input type="password" />
              </FormGroup>
              
              <FormGroup>
                <Label>Confirmar Nova Senha</Label>
                <Input type="password" />
              </FormGroup>
              
              <Button>Alterar Senha</Button>
            </>
          )}
        </SettingsContent>
      </ContentContainer>
    </Container>
  );
};

export default SettingsPage;