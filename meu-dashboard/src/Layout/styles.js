import styled, { createGlobalStyle } from 'styled-components';

// Estilos globais
export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
`;

// Componente principal do layout
export const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;