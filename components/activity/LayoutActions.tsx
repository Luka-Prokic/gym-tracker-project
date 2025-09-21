import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Colors, { Themes } from '../../constants/Colors';
import IButton from '../buttons/IButton';
import { Ionicons } from '@expo/vector-icons';
import { useExerciseLayout } from '../context/ExerciseLayoutZustand';

interface LayoutActionsProps {
    layoutId: string;
    layoutName: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

const LayoutActions: React.FC<LayoutActionsProps> = ({
    layoutId,
    layoutName,
    onEdit,
    onDelete
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { safeDeleteLayout } = useExerciseLayout();

    const handleDelete = () => {
        Alert.alert(
            "Delete Layout",
            `Are you sure you want to delete "${layoutName}"?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        const deleted = safeDeleteLayout(layoutId);
                        if (deleted) {
                            onDelete?.();
                        } else {
                            Alert.alert(
                                "Cannot Delete",
                                "This layout is used by a completed workout and cannot be deleted.",
                                [{ text: "OK" }]
                            );
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <IButton
                width={40}
                height={40}
                onPress={() => onEdit?.()}
                style={styles.actionButton}
            >
                <Ionicons name="create-outline" size={20} color={color.accent} />
            </IButton>

            <IButton
                width={40}
                height={40}
                onPress={handleDelete}
                style={styles.actionButton}
            >
                <Ionicons name="trash-outline" size={20} color={color.error} />
            </IButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        borderRadius: 8,
    },
});

export default LayoutActions;
