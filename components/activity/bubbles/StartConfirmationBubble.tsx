import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Colors, { Themes } from '../../../constants/Colors';
import IBubble, { IBubbleSize } from '../../bubbles/IBubble';
import Container from '../../containers/Container';
import IButton from '../../buttons/IButton';

interface StartConfirmationBubbleProps {
    visible: boolean;
    onClose: () => void;
    height: number;
    width: number;
    top: number;
    left: number;
    startLayout: any;
    onConfirm: () => void;
    onCancel: () => void;
}

export const StartConfirmationBubble: React.FC<StartConfirmationBubbleProps> = ({
    visible,
    onClose,
    height,
    width,
    top,
    left,
    startLayout,
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
                    Are you sure about that?
                </Text>

                <Text style={{
                    fontSize: 13,
                    color: color.grayText,
                    textAlign: "center",
                    marginBottom: 16,
                    lineHeight: 18
                }}>
                    Start a new workout using "{startLayout?.name || 'this template'}"?
                </Text>

                <View style={{ gap: 10 }}>
                    <IButton
                        width={"100%"}
                        height={40}
                        title={"Start"}
                        color={color.accent}
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
