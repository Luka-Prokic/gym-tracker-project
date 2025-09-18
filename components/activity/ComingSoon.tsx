import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';
import Container from '../containers/Container';
import { Ionicons } from '@expo/vector-icons';
import hexToRGBA from '../../assets/hooks/HEXtoRGB';

interface ComingSoonProps {
    icon: string;
    title: string;
    description: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ icon, title, description }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    return (
        <Container width={"100%"} style={styles.comingSoon}>
            <View style={[styles.comingSoonIcon, { backgroundColor: hexToRGBA(color.accent, 0.2) }]}>
                <Ionicons name={icon as any} size={32} color={color.accent} />
            </View>
            <Text style={[styles.comingSoonTitle, { color: color.text }]}>
                {title}
            </Text>
            <Text style={[styles.comingSoonText, { color: color.grayText }]}>
                {description}
            </Text>
        </Container>
    );
};

const styles = StyleSheet.create({
    comingSoon: {
        alignItems: 'center',
        padding: 24,
        gap: 8,
    },
    comingSoonIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    comingSoonTitle: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
    comingSoonText: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
        fontWeight: '400',
    },
});

export default ComingSoon;
