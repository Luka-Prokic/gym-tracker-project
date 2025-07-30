import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";

interface IDateDisplayProps {
    style?: TextStyle;
    type?: 'Standard' | 'Label';
    color?: string;
}

const DateDisplay: React.FC<IDateDisplayProps> = ({ style, type = "Label", color }) => {
    const formatDate = () => {
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            day: "2-digit",
            month: "short",
        };
        return date.toLocaleDateString("en-US", options).toUpperCase();
    };

    return <Text style={[type === 'Label' ? styles.label : styles.dateText, { color: color }, style]}>{formatDate()}</Text >;
};

const styles = StyleSheet.create({
    dateText: {
        fontSize: 18,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    label: {
        fontSize: 10,
        textTransform: 'uppercase',
    },
});

export default DateDisplay;