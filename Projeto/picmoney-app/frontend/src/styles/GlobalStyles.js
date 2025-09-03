import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #f8fafc;
  }

  #root {
    min-height: 100vh;
  }
`;