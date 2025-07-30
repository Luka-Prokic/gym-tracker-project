import React from "react";
import { View, Text, StyleSheet, ViewStyle, DimensionValue } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";

interface IContainerProps {
    width?: DimensionValue;
    height?: DimensionValue;
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    style?: ViewStyle | ViewStyle[];
    color?: string;
    loading?: boolean;
    children?: React.ReactNode;
    label?: string;
}

const Container: React.FC<IContainerProps> = ({
    width = 'auto',
    height = 'auto',
    direction = 'column',
    style,
    color = 'transparent',
    loading = false,
    children,
    label
}) => {
    const { theme } = useTheme();
    const colors = Colors[theme as Themes];

    return (
        <View style={[styles.container]}>
            <Text style={[styles.label, { color: colors.grayText, width }]}>{label}</Text>
            <View
                style={[
                    styles.bubble,
                    {
                        width,
                        height,
                        flexDirection: direction,
                        backgroundColor: color,
                    },
                    style,
                ]}
            >
                {children}
            </View >
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        userSelect: 'none',
    },
    bubble: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    label: {
        fontSize: 12,
        textTransform: 'uppercase',
        padding: 2,
        paddingLeft: 8,
    },
});

export default Container;