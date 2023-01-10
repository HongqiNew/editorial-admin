import '../styles/globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { AppProps } from 'next/app'
import React, { useEffect, useMemo, useState } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import { ThemeProvider } from '@emotion/react';
import { useMediaQuery, createTheme } from '@mui/material';
import LayoutBar from '../layout/bar';

function App({ Component, pageProps }: AppProps) {
  const isSystemDarkModeEnabled = useMediaQuery('(prefers-color-scheme: dark)');
  // 是否开启系统
  const theme = useMemo(() => (
    createTheme({
      typography: {
        fontFamily: 'tongyong',
      },
      palette: {
        mode: isSystemDarkModeEnabled ? 'dark' : 'light',
      },
    })
  ),
    [isSystemDarkModeEnabled],
  );
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </UserProvider>
  )
}

export default App;
