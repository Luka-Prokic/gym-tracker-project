import { ThemeProvider, useTheme } from '../components/context/ThemeContext';
import { Themes } from '../constants/Colors';
import React from 'react';
import { StatusBar } from 'react-native';
import Layout from './_layout';

export default function App() {
  const { theme } = useTheme();

  const backgroundColor = {
    light: '#FFFFFF',
    peachy: '#FFFEF6',
    oldschool: '#FFFEF6',
    dark: '#1C1C1E',
    preworkout: '#222222',
    Corrupted: '#222222',
  }[theme as Themes];

  const barStyle = theme === 'dark' || theme === 'preworkout' ? 'light-content' : 'dark-content';

  return (
    <ThemeProvider>
      <StatusBar
        barStyle={barStyle}
        backgroundColor={backgroundColor}
      />
      <Layout />
    </ThemeProvider>
  );
}