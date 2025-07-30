import React from "react";
import { TouchableOpacity, Text, StyleSheet, DimensionValue, ViewStyle } from "react-native";
import { ButtonLength } from "./IButton";

interface LilButtonProps {
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
    style?: ViewStyle;
}

const LilButton: React.FC<LilButtonProps> = ({ title, onPress, disabled = false, children, color, style, textColor = "#1C1C1E", width = 'auto', height = 'auto', length = 'medium', loading }) => {
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
            style={[styles.button, disabled && styles.disabled, { backgroundColor: buttonColor, aspectRatio: aspectRatio }, { width: width }, { height: height }, style]}
            onPress={onPress}
            disabled={disabled}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            {children ? children : <Text style={[styles.text, { color: textColor }]}>{title}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 88,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        overflow: "hidden",
        zIndex: 1,
        userSelect: "none",
    },
    text: {
        fontSize: 14,
        fontWeight: "bold",
    },
    disabled: {
        backdropFilter: 'blur(10px)',
        filter: 'blur(1px)'
    },
});

export default LilButton;