import React, { useState } from 'react';
import styled from 'styled-components';

// Styled Components para a página de Login
const LoginContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f7f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
`;

const LoginTitle = styled.h2`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
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
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  background: #3498db;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.3s;
  margin-top: 10px;
  
  &:hover {
    background: #2980b9;
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  background: #fadbd8;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: #27ae60;
  background: #d5f5e3;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;
`;

const ForgotPassword = styled.a`
  display: block;
  text-align: center;
  color: #3498db;
  margin-top: 20px;
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SignupLink = styled.div`
  text-align: center;
  margin-top: 30px;
  color: #7f8c8d;
  
  a {
    color: #3498db;
    text-decoration: none;
    font-weight: 500;
    margin-left: 5px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// Componente da página de Login
const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulação de autenticação
    try {
      // Aqui você faria a chamada à API real
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validação simples
      if (!email || !password) {
        throw new Error('Por favor, preencha todos os campos');
      }
      
      if (!email.includes('@')) {
        throw new Error('Por favor, insira um email válido');
      }
      
      // Simulando login bem-sucedido
      console.log('Login realizado com:', { email, password });
      
      // Chamando a função de sucesso passada por props
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>Login PicMoney</LoginTitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={isLoading}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Senha</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              disabled={isLoading}
            />
          </FormGroup>
          
          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </LoginButton>
        </form>
        
        <ForgotPassword>Esqueci minha senha</ForgotPassword>
        
        <SignupLink>
          Não tem uma conta? <a href="#signup">Cadastre-se</a>
        </SignupLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;