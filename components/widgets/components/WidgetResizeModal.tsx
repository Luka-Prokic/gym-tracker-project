import React, { useState } from "react";
import Colors, { Themes } from "../../../constants/Colors";
import { useTheme } from "../../context/ThemeContext";
import OptionButton from "../../buttons/OptionButton";
import IBubble, { IBubbleSize } from "../../bubbles/IBubble";
import { Text, View } from "react-native";
import Container from "../../containers/Container";
import IButton from "../../buttons/IButton";
import useBubbleLayout from "../../bubbles/hooks/useBubbleLayout";
import { Ionicons } from "@expo/vector-icons";
import useWidgetActions from "../hooks/useWidgetActions";
import WidgetSizePicker from "../slider/WidgetSizePicker";

interface WidgetResizeModalProps {
    onClose: () => void,
    id: string,
}

const WidgetResizeModal: React.FC<WidgetResizeModalProps> = ({ id, onClose }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { bubbleRef, top, left, width, height } = useBubbleLayout();
    const { widgetData } = useWidgetActions(id);

    if (!widgetData) return null;

    const [visible, setVisible] = useState(false);

    const buttonWidth = 177;

    return (
        <View ref={bubbleRef} style={{ flex: 1 }}>
            <OptionButton
                title="Resize"
                color={color.text}
                onPress={() => setVisible(true)}
                icon={<Ionicons name="resize" size={16} color={color.text} />}
            />
            <IBubble
                visible={visible}
                onClose={() => {
                    setVisible(false);
                }}
                height={height}
                width={width}
                top={top}
                left={left}
                size={IBubbleSize.large}
            >
                <Container width={"100%"} height={"100%"} direction="column" >
                    <WidgetSizePicker
                        id={id}
                        width={buttonWidth}
                        onPress={() => {
                            setVisible(false);
                            onClose();
                        }}
                    />
                </Container>
            </IBubble>
        </View>
    );
};

export default WidgetResizeModal;