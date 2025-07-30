import React from 'react';
import { StatusBar } from 'react-native';
import Layout from './app/_layout';
import { useTheme } from "./components/context/ThemeContext";
import { Themes } from './constants/Colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
    const { theme } = useTheme();

    const backgroundColor = {
        light: '#FFFFFF',
        peachy: '#FFFFFF',
        oldschool: '#FFFEF6',
        dark: '#1C1C1E',
        preworkout: '#222222',
        Corrupted: '#222222',
    }[theme as Themes];

    const barStyle = theme === 'dark' || theme === 'preworkout' || theme === 'Corrupted' ? 'light-content' : 'dark-content';

    return (
        <SafeAreaProvider>
            <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />
            <Layout />
        </SafeAreaProvider>
    );
}