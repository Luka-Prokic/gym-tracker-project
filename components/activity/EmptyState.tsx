import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';
import Container from '../containers/Container';
import IButton from '../buttons/IButton';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
    icon: string;
    title: string;
    subtitle: string;
    buttonText?: string;
    onButtonPress?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
    icon, 
    title, 
    subtitle, 
    buttonText, 
    onButtonPress 
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    return (
        <Container width={"100%"} style={styles.emptyState}>
            <Ionicons name={icon as any} size={48} color={color.grayText} />
            <Text style={[styles.emptyText, { color: color.grayText }]}>
                {title}
            </Text>
            <Text style={[styles.emptySubtext, { color: color.grayText }]}>
                {subtitle}
            </Text>
            {buttonText && onButtonPress && (
                <IButton
                    width={"100%"}
                    height={44}
                    title={buttonText}
                    color={color.primaryBackground}
                    textColor={color.accent}
                    onPress={onButtonPress}
                    style={styles.quickStartButton}
                />
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    emptyState: {
        alignItems: 'center',
        padding: 24,
        gap: 12,
    },
    emptyText: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 13,
        textAlign: 'center',
        fontWeight: '400',
    },
    quickStartButton: {
        marginTop: 8,
    },
});

export default EmptyState;
