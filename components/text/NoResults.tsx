import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/components/context/ThemeContext";
import Colors, { Themes } from "@/constants/Colors";

interface NoResultsProps {
    message?: string;
}

const NoResults: React.FC<NoResultsProps> = ({ message = "No results found" }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    return (
        <View style={styles.container}>
            <Ionicons name="search" size={48} color={color.grayText} />
            <Text style={[styles.message, { color: color.grayText }]}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
    },
    message: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 16,
        fontWeight: "bold",
    },
});

export default NoResults;
