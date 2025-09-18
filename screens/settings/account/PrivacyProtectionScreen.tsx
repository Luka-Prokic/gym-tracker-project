import React from "react";
import { ActivityIndicatorBase, StyleSheet, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "../../../components/context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import CardWrapper from "../../../components/bubbles/CardWrapper";


export default function PrivacyProtectionScreen() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];



    return (
        <CardWrapper>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={[{
                    paddingBottom: 88, paddingTop: 44, width: "100%", backgroundColor: color.background,
                }]}
            >
            </ScrollView>
        </CardWrapper>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 16,
        fontWeight: "bold",
    },
});