import React from "react";
import { View, Text, StyleSheet, ViewStyle, DimensionValue } from "react-native";
import { useTheme } from "../../components/context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";

interface IHR {
    style?: ViewStyle;
    width?: DimensionValue;
}

const HR: React.FC<IHR> = ({ style, width }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    return (
        <View style={[styles.hr, { backgroundColor: color.grayText, width: width }, style]} />
    );
};

const styles = StyleSheet.create({
    hr: {
        height: 1,
        opacity: 0.2,
        width: '100%',
    },
});

export default HR;