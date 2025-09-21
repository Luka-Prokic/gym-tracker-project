import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';
import IButton from '../buttons/IButton';
import { Ionicons } from '@expo/vector-icons';

interface TabButtonProps {
    label: string;
    icon: string;
    isSelected: boolean;
    onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isSelected, onPress }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    // Use filled icon when selected
    const iconName = isSelected ? icon.replace('-outline', '') : icon;

    return (
        <IButton
            width={"33%"}
            height={44}
            style={[
                styles.tabButton,
                isSelected ? {} : { opacity: 0.6 }
            ]}
            onPress={onPress}
        >
            <View style={styles.tabContent}>
                <Ionicons name={iconName as any} size={20} color={color.accent} />
                <Text style={[styles.tabText, { color: color.text }]}>{label}</Text>
            </View>
        </IButton>
    );
};

const styles = StyleSheet.create({
    tabButton: {
        borderRadius: 0,
        borderBottomWidth: 0,
        paddingVertical: 12,
    },
    tabContent: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
    },
    tabText: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

export default TabButton;
