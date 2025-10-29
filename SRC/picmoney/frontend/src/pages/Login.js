// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import styled from 'styled-components';

const LoginWrapper = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  display: flex; justify-content: center; align-items: center;
  background: #f8fafc; overflow: hidden;
`;
const Form = styled.form`
  background: white; padding: 40px; border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1); width: 350px;
  display: flex; flex-direction: column; align-items: stretch;
`;
const Title = styled.h2` text-align: center; margin-bottom: 25px; color: #1f2937; `;
const Input = styled.input`
  width: 100%; padding: 12px; margin-bottom: 20px;
  border: 1px solid #d1d5db; border-radius: 8px; font-size: 15px; outline: none;
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,.2); }
`;
const Button = styled.button`
  width: 100%; background: #3b82f6; color: white; border: none;
  padding: 12px; border-radius: 8px; font-size: 16px; cursor: pointer;
  transition: all .2s ease; &:hover { background: #2563eb; }
`;
const ErrorMsg = styled.p` color: red; text-align: center; margin-top: 10px; `;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);   // chama backend
      navigate("/reports");              // redireciona
    } catch (err) {
      setError("Usuário ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginWrapper>
      <Form onSubmit={handleSubmit}>
        <Title>Login - PicMoney</Title>

        <Input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
          required
        />

        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        {error && <ErrorMsg>{error}</ErrorMsg>}
      </Form>
    </LoginWrapper>
  );
}
