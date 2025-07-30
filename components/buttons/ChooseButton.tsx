import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, DimensionValue, ViewStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";

interface ChooseButtonProps {
    title: string;
    onPress: () => void;
    width?: DimensionValue;
    height?: DimensionValue;
    children?: React.ReactNode;
    color?: string;
    style?: ViewStyle;
    icon?: React.ReactNode;
}

const ChooseButton: React.FC<ChooseButtonProps> = ({
    title,
    onPress,
    children,
    width = "100%",
    height = 44,
    style,
    icon,
    color
}) => {
    const { theme } = useTheme();
    const colors = Colors[theme as Themes];

    return (
        <TouchableOpacity
            style={[styles.container, style, { width, height, backgroundColor: color }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.icon}>
                {icon}
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <View style={styles.rightSection}>
                {children}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        minHeight: 24,
        width: "100%",
        gap: 8,
    },
    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
    },
    rightSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        flexDirection: "row-reverse",
        alignItems: "center",
    },
});

export default ChooseButton;