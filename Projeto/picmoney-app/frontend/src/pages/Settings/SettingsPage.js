import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/Header/Header';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 30px;
`;

const SettingsCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 20px;
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

const Select = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

const Button = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.3s;
  
  &:hover {
    background: #2980b9;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  margin-right: 10px;
  
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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const SettingsPage = () => {
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

  return (
    <>
      <Header title="Configurações" />
      <Container>
        <Title>Configurações</Title>
        
        <SettingsCard>
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
        </SettingsCard>

        <SettingsCard>
          <SectionTitle>Preferências de Conta</SectionTitle>
          
          <FormGroup>
            <Label>Idioma</Label>
            <Select defaultValue="pt-br">
              <option value="pt-br">Português (Brasil)</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Fuso Horário</Label>
            <Select defaultValue="america-sao_paulo">
              <option value="america-sao_paulo">America/Sao_Paulo (GMT-3)</option>
              <option value="utc">UTC</option>
              <option value="est">EST (GMT-5)</option>
            </Select>
          </FormGroup>
          
          <Button>Salvar Preferências</Button>
        </SettingsCard>

        <SettingsCard>
          <SectionTitle>Segurança</SectionTitle>
          
          <FormGroup>
            <Label>Senha Atual</Label>
            <Input type="password" placeholder="Digite sua senha atual" />
          </FormGroup>
          
          <FormGroup>
            <Label>Nova Senha</Label>
            <Input type="password" placeholder="Digite a nova senha" />
          </FormGroup>
          
          <FormGroup>
            <Label>Confirmar Nova Senha</Label>
            <Input type="password" placeholder="Confirme a nova senha" />
          </FormGroup>
          
          <Button>Alterar Senha</Button>
        </SettingsCard>
      </Container>
    </>
  );
};

export default SettingsPage;