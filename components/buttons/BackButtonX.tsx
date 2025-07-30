import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Colors, { Themes } from "../../constants/Colors";
import { useTheme } from "../context/ThemeContext";

const BackButtonX: React.FC = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    return (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={styles.hitSlop}>
            <Ionicons name="close" size={24} color={color.text} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    backButton: {
        position: "absolute",
        top: 0,
        left: 0,
        height: 34,
        width: 34,
        justifyContent: "center",
        alignItems: "center",
    },
    hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
});

export default BackButtonX;