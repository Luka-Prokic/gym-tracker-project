import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Colors, { Themes } from '../../../constants/Colors';
import IBubble, { IBubbleSize } from '../../bubbles/IBubble';
import Container from '../../containers/Container';
import OptionButton from '../../buttons/OptionButton';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface EditOptionsBubbleProps {
    visible: boolean;
    onClose: () => void;
    height: number;
    width: number;
    top: number;
    left: number;
    editOptionsLayout: any;
    onStartWorkout: () => void;
    onEditTemplate: () => void;
    onCloneTemplate: () => void;
    onDeleteTemplate: () => void;
}

export const EditOptionsBubble: React.FC<EditOptionsBubbleProps> = ({
    visible,
    onClose,
    height,
    width,
    top,
    left,
    editOptionsLayout,
    onStartWorkout,
    onEditTemplate,
    onCloneTemplate,
    onDeleteTemplate
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
                    "{editOptionsLayout?.name || 'this template'}"
                </Text>

                <View style={{ gap: 12, width: '100%' }}>
                    <OptionButton
                        title="Start Workout"
                        onPress={onStartWorkout}
                        icon={<Ionicons name="play" size={20} color={color.accent} />}
                        color={color.accent}
                    />

                    <OptionButton
                        title="Edit Template"
                        onPress={onEditTemplate}
                        icon={<Ionicons name="create-outline" size={20} color={color.text} />}
                        color={color.text}
                    />

                    <OptionButton
                        title="Clone Template"
                        onPress={onCloneTemplate}
                        icon={<Ionicons name="copy-outline" size={20} color={color.text} />}
                        color={color.text}
                    />

                    <OptionButton
                        title="Delete Template"
                        onPress={onDeleteTemplate}
                        icon={<Ionicons name="trash-outline" size={20} color={color.error} />}
                        color={color.error}
                    />
                </View>
            </Container>
        </IBubble>
    );
};
