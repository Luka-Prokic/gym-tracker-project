import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Colors, { Themes } from '../../../constants/Colors';
import IBubble, { IBubbleSize } from '../../bubbles/IBubble';
import Container from '../../containers/Container';
import IButton from '../../buttons/IButton';

interface DeleteConfirmationBubbleProps {
    visible: boolean;
    onClose: () => void;
    height: number;
    width: number;
    top: number;
    left: number;
    deleteLayout: any;
    deleteRoutine: any;
    onConfirm: () => void;
    onCancel: () => void;
}

export const DeleteConfirmationBubble: React.FC<DeleteConfirmationBubbleProps> = ({
    visible,
    onClose,
    height,
    width,
    top,
    left,
    deleteLayout,
    deleteRoutine,
    onConfirm,
    onCancel
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    return (
        <IBubble
            visible={visible}
            onClose={onClose}
            height={height}
            width={width}
            top={top}
            left={left}
            size={IBubbleSize.large}
        >
            <Container width={"90%"} height={"100%"} direction="column">
                <Text style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: color.text,
                    textAlign: "center",
                    marginBottom: 12
                }}>
                    {deleteLayout ? "Delete Template" : "Delete Workout"}
                </Text>

                <Text style={{
                    fontSize: 13,
                    color: color.grayText,
                    textAlign: "center",
                    marginBottom: 16,
                    lineHeight: 18
                }}>
                    {deleteLayout
                        ? `Delete the template "${deleteLayout?.name || 'template'}"? This will permanently remove it from Templates and cannot be undone; your past workouts won't change.`
                        : `This will permanently remove it from your workout history and cannot be undone. Your logged progress and statistics will be affected.`}
                </Text>

                <View style={{ gap: 10 }}>
                    <IButton
                        width={"100%"}
                        height={40}
                        title={"Delete"}
                        color={color.error}
                        textColor={color.secondaryText}
                        onPress={onConfirm}
                    />

                    <IButton
                        width={"100%"}
                        height={40}
                        title={"Cancel"}
                        color={color.primaryBackground}
                        textColor={color.accent}
                        onPress={onCancel}
                    />
                </View>
            </Container>
        </IBubble>
    );
};
