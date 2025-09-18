import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import IButton from "../buttons/IButton";
import Colors, { Themes } from "../../constants/Colors";
import { useTheme } from "../context/ThemeContext";
import { router } from "expo-router";
import capitalizeWords from "@/assets/hooks/capitalize";

interface SettingsHeaderProps {
    title?: string;
    headerLeft?: () => React.ReactNode;
    headerRight?: (props: { tintColor: string }) => React.ReactNode;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
    title = "Settings",
    headerLeft,
    headerRight,
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const titleFix = title == "index" ? "Settings" : capitalizeWords(title);

    return (
        <View style={[styles.header, { backgroundColor: color.background }]}>
            <View style={styles.leftContainer}>
                {headerLeft ? headerLeft() : (
                    <IButton width={34} height={34} onPress={() => router.back()}>
                        <FontAwesome name="angle-left" size={26} color={color.tint} />
                    </IButton>
                )}
            </View>
            <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: color.text }]}>{titleFix}</Text>
            </View>
            <View style={styles.rightContainer}>
                {headerRight ? headerRight({ tintColor: color.text }) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 34,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 0,
        backdropFilter: "blur(10px)",
        ...Platform.select({
            ios: {
                shadowOpacity: 0,
            },
            android: {
                elevation: 0,
            },
        }),
    },
    leftContainer: {
        flex: 1,
        paddingLeft: 10,
    },
    titleContainer: {
        flex: 3,
        alignItems: "center",
    },
    rightContainer: {
        flex: 1,
        paddingRight: 10,
        alignItems: "flex-end",
    },
    title: {
        fontWeight: "bold",
        fontSize: 18,
    },
});

export default SettingsHeader;