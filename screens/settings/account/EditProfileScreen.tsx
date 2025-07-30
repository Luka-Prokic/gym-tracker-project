import React from "react";
import { StyleSheet, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "../../../components/context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";


export default function EditProfileScreen() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];



    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ paddingBottom: 88, width: "100%", backgroundColor: color.secondaryBackground }}
        >
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 16,
        fontWeight: "bold",
    },
});