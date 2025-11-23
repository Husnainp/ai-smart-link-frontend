import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#0b74ff',
    primaryHover: '#095fdb',
    foreground: '#0f1720',
    background: '#ffffff',
    muted: '#6b7280',
    border: '#e5e7eb',
  },
  radii: {
    sm: '6px',
    md: '10px',
  },
  spacing: (value) => `${value * 4}px`,
};

export const GlobalStyle = createGlobalStyle`
  :root{
    --color-primary: ${theme.colors.primary};
    --color-foreground: ${theme.colors.foreground};
    --color-background: ${theme.colors.background};
  }

  html,body,#root,#__next{
    height:100%;
  }

  body{
    margin:0;
    color: ${theme.colors.foreground};
    background: ${theme.colors.background};
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
  }

  button{font-family:inherit}
  input{font-family:inherit}
`;

export default theme;
