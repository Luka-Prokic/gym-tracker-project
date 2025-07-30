import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors, { Themes } from "../../../constants/Colors";
import { useTheme } from "../../context/ThemeContext";
import ISlide from "../../bubbles/ISlide";
import IText from "../../text/IText";
import { useCaka } from "../../context/CakaAppZustand";
import OptionButton from "../../buttons/OptionButton";
import { Ionicons } from "@expo/vector-icons";
import IBubble, { IBubbleSize } from "../../bubbles/IBubble";
import useBubbleLayout from "../../bubbles/hooks/useBubbleLayout";
import Container from "../../containers/Container";

interface WidgetRenameModalProps {
    onClose: () => void,
    id: string,
}

const WidgetRenameModal: React.FC<WidgetRenameModalProps> = ({ id, onClose }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { widgetLayout, setWidgetLayout } = useCaka();

    const { bubbleRef, top, left, width, height } = useBubbleLayout();

    const [visible, setVisible] = useState(false);

    const widgetData = widgetLayout.find((w) => w.id === id);
    if (!widgetData) return null;

    const handleLabelChange = (newLabel: string) => {
        setWidgetLayout(
            widgetLayout.map((w) => (w.id === id ? { ...w, label: newLabel } : w))
        );
    };

    return (
        <View ref={bubbleRef} style={{ flex: 1 }}>
            <OptionButton title="Rename" color={color.text}
                onPress={() => setVisible(true)}
                icon={
                    <Ionicons name="pencil" size={16} color={color.text} />
                }
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
                size={IBubbleSize.xs}
            >
                <IText
                    textStyle={[styles.renameText, { color: color.grayText }]}
                    inputStyle={{ fontWeight: "bold" }}
                    style={styles.rename}
                    value={widgetData.label}
                    iconColor={color.grayText}
                    onChange={handleLabelChange}
                    focus={true}
                />
            </IBubble >
        </View>
    );
};

const styles = StyleSheet.create({
    renameText: {
        fontSize: 34,
        fontWeight: "bold",
        userSelect: "none",
        textAlign: "center",
    },
    rename: {
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontWeight: "bold",
        fontSize: 42,
    },
});

export default WidgetRenameModal;