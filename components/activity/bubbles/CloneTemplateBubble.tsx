import React from 'react';
import { Text, View, TextInput } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Colors, { Themes } from '../../../constants/Colors';
import IBubble, { IBubbleSize } from '../../bubbles/IBubble';
import Container from '../../containers/Container';
import IButton from '../../buttons/IButton';

interface CloneTemplateBubbleProps {
    visible: boolean;
    onClose: () => void;
    height: number;
    width: number;
    top: number;
    left: number;
    cloneLayout: any;
    cloneName: string;
    onCloneNameChange: (name: string) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

export const CloneTemplateBubble: React.FC<CloneTemplateBubbleProps> = ({
    visible,
    onClose,
    height,
    width,
    top,
    left,
    cloneLayout,
    cloneName,
    onCloneNameChange,
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
                    marginBottom: 20
                }}>
                    Clone "{cloneLayout?.name || 'this template'}"
                </Text>

                <View style={{ gap: 16, width: '100%' }}>
                    <View>
                        <TextInput
                            style={{
                                height: 44,
                                borderWidth: 1,
                                borderColor: color.border,
                                borderRadius: 10,
                                paddingHorizontal: 16,
                                fontSize: 16,
                                color: color.text,
                                backgroundColor: color.background
                            }}
                            value={cloneName}
                            onChangeText={onCloneNameChange}
                            placeholder="Enter clone name"
                            placeholderTextColor={color.secondaryText}
                            maxLength={50}
                            autoFocus
                        />
                        <Text style={{
                            fontSize: 12,
                            color: color.grayText,
                            marginTop: 4,
                            textAlign: "center"
                        }}>
                            Clone Name
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <IButton
                            height={44}
                            width="48%"
                            color={color.thirdBackground}
                            textColor={color.text}
                            title="Cancel"
                            onPress={onCancel}
                        />
                        <IButton
                            height={44}
                            width="48%"
                            color={color.accent}
                            textColor={color.secondaryText}
                            title="Clone"
                            onPress={onConfirm}
                        />
                    </View>
                </View>
            </Container>
        </IBubble>
    );
};
