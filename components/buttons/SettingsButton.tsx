import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, DimensionValue, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import Colors from "../../constants/Colors";
import { Themes } from "../../constants/Colors";

interface SettingsButtonProps {
    title: string;
    onPress?: () => void;
    arrow?: boolean;
    info?: string;
    width?: DimensionValue;
    height?: DimensionValue;
    icon?: React.ReactNode;
    style?: ViewStyle;
    color?: string;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({
    title,
    onPress,
    icon,
    arrow = false,
    info,
    width = "100%",
    height = 44,
    style,
    color,
}) => {
    const { theme } = useTheme();
    const colors = Colors[theme as Themes];

    return (
        <TouchableOpacity
            style={[styles.container, style, { width, height }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.icon}>
                {icon ? icon : <View style={[{ width: 18, height: '100%'}]} />}
            </View>
            <Text style={[styles.title, { color: color || colors.text }]}>{title}</Text>
            <View style={styles.rightSection}>
                {arrow && <Ionicons name="chevron-forward" size={18} color={colors.grayText} />}
                {info && <Text style={[styles.info, { color: colors.grayText }]}>{info}</Text>}
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
    },
    icon: {
        marginRight: 12,
    },
    title: {
        flex: 1,
        fontSize: 14,
    },
    rightSection: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 8,
    },
    info: {
        fontSize: 14,
    },
});

export default SettingsButton;