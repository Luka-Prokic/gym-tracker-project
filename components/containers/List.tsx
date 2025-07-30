import React from "react";
import { View, Text, StyleSheet, ViewStyle, DimensionValue } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import HR from "../mis/HR";

interface IListProps {
    width?: DimensionValue;
    background?: string;
    children?: React.ReactNode;
    style?: ViewStyle;
    label?: string;
    hrStart?: 'Standard' | 'Custom';
}

const List: React.FC<IListProps> = ({
    width = '100%',
    background = 'transparent',
    children,
    style,
    label,
    hrStart = 'Standard',
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const childrenWithBreaks = React.Children.toArray(children).map((child, index, array) => (
        <View key={index} style={[{ flexDirection: 'column', width: '100%', }, style ? { gap: style.gap } : {}]}>
            {child}
            {index < array.length - 1 && (
                <View style={hrStart === 'Standard' ? styles.viewStandard : styles.viewCustom}>
                    <HR />
                </View>
            )}
        </View >
    ));

    return (
        <View style={[styles.container]}>
            <Text style={[styles.label, { color: color.grayText, width }]}>{label}</Text>
            <View
                style={[
                    styles.bubble,
                    {
                        width,
                        backgroundColor: background,
                    },
                    style,
                ]}
            >
                {childrenWithBreaks}
            </View>
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
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewStandard: {
        width: '100%'
    },
    viewCustom: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 42,
        width: '100%'
    },

    label: {
        fontSize: 12,
        textTransform: 'uppercase',
        padding: 2,
        paddingLeft: 8,
    },
});

export default List;
