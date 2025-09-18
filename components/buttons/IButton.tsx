import React, { useEffect, useRef, forwardRef } from "react";
import { TouchableOpacity, Text, StyleSheet, DimensionValue, ViewStyle, Animated } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "@/constants/Colors";

export type ButtonLength = 'xs' | 'short' | 'medium' | 'long' | 'xl' | 'one' | 'golden';

interface IButtonProps {
    title?: string;
    onPress?: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
    color?: string;
    textColor?: string;
    width?: DimensionValue;
    height?: DimensionValue;
    loading?: boolean;
    length?: ButtonLength;
    style?: ViewStyle | ViewStyle[];
}

const IButton = forwardRef<TouchableOpacity, IButtonProps>(({ title, onPress, disabled = false, children, color, style, textColor, width = 'auto', height = 'auto', length = 'medium', loading }, ref) => {
    const { theme } = useTheme();
    const colors = Colors[theme as Themes];
    const buttonColor = color;

    const aspectRatioMap = {
        xs: 2 / 1,
        short: 2.6 / 1,
        medium: 3 / 1,
        long: 4 / 1,
        xl: 5 / 1,
        one: 1 / 1,
        golden: 1.618
    };

    const aspectRatio = aspectRatioMap[length];

    return (
        <TouchableOpacity
            ref={ref}
            style={[styles.button, disabled && styles.disabled, { backgroundColor: buttonColor, aspectRatio: aspectRatio }, { width: width }, { height: height }, style]}
            onPress={onPress}
            disabled={disabled}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            {children ? children : <Text style={[styles.text, { color: textColor ?? colors.text }]}>{title}</Text>}
        </TouchableOpacity>
    );
});

IButton.displayName = 'IButton';

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        overflow: "hidden",
        gap: 8,
        zIndex: 1,
        userSelect: "none",
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
    },
    disabled: {
        backdropFilter: 'blur(10px)',
        filter: 'blur(1px)'
    },
});

export default IButton;