import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, DimensionValue, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";

interface WidgetButtonProps {
    title: string;
    onPress?: () => void;
    onLongPress?: () => void;
    onPressOut?: () => void;
    arrow?: boolean;
    info?: string;
    width?: DimensionValue;
    height?: DimensionValue;
    style?: ViewStyle;
    color?: string;
    disabled?: boolean;
}

const WidgetButton: React.FC<WidgetButtonProps> = ({
    title,
    onPress,
    onLongPress,
    onPressOut,
    arrow = false,
    info,
    width = "100%",
    style,
    color,
    disabled,
}) => {
    const { theme } = useTheme();
    const colors = Colors[theme as Themes];

    return (
        <TouchableOpacity
            style={[styles.container, style, { width }]}
            onPress={onPress}
            onLongPress={onLongPress}
            onPressOut={onPressOut}
            activeOpacity={0.7}
            disabled={disabled}
        >
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <View style={styles.rightSection}>
                {arrow && <Ionicons name="chevron-forward" size={18} color={color || colors.accent} />}
                {info && <Text style={[styles.info, { color: colors.grayText }]}>{info}</Text>}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        height: 34,
        width: "100%",
    },
    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: "bold",
        width: "100%",
        paddingLeft: 4,
    },
    rightSection: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 8,
    },
    info: {
        fontSize: 14,
        textTransform: "capitalize",
    },
});

export default WidgetButton;