import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, DimensionValue, ViewStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";

interface OptionButtonProps {
    title: string;
    onPress?: () => void;
    width?: DimensionValue;
    height?: DimensionValue;
    icon?: React.ReactNode;
    style?: ViewStyle;
    color?: string;
    disabled?: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({
    title,
    onPress,
    icon,
    width = "100%",
    height,
    style,
    color,
    disabled
}) => {
    const { theme } = useTheme();
    const colors = Colors[theme as Themes];

    return (
        <TouchableOpacity
            style={[styles.container, style, { width, height }]}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={disabled}
        >
            <Text style={[styles.title, { color: color || colors.text }]}>{title}</Text>
            <View style={styles.icon}>
                {icon}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 12,
        minHeight: 24,
        width: "100%",
    },
    title: {
        flex: 1,
        fontSize: 16,
    },
    icon: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 8,
    },
});

export default OptionButton;