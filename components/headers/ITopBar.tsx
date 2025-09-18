import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { router } from "expo-router";
import IButton from "../buttons/IButton";
import { Ionicons } from "@expo/vector-icons";

interface ITopBarProps {
    title?: string;
    children?: React.ReactNode;
    headerLeft?: () => React.ReactNode;
    headerRight?: () => React.ReactNode;
}

const ITopBar: React.FC<ITopBarProps> = ({ title, children, headerLeft, headerRight }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const backgroundColor = {
        light: "rgba(255, 255, 255, 0.2)",
        peachy: "rgba(255, 255, 255, 0.2)",
        oldschool: "rgba(255, 254, 246, 0.2)",
        dark: "rgba(100, 100, 100, 0.2)",
        preworkout: "rgba(255, 254, 246, 0.2)",
        Corrupted: "rgba(100, 255, 255, 0.2)",
    }[theme as Themes];

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={[styles.leftContainer]}>
                {headerLeft ? headerLeft() : (
                    <IButton width={34} height={34} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color={color.text} />
                    </IButton>
                )}
            </View>
            <View style={styles.center}>
                {children || (title && (
                    <Text style={[styles.title, { color: color.text }]}>
                        {title}
                    </Text>
                ))}
            </View>
            <View style={styles.rightContainer}>
                {headerRight ? headerRight() : <></>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 34,
        width: '100%',
        flexDirection: "row",
        position: "fixed",
        alignItems: "center",
        justifyContent: "center",
        top: 0,
        userSelect: "none",
        zIndex: 2,
        backdropFilter: 'blur(10px)',
    },
    center: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
    },
    leftContainer: {
        height: "100%",
        alignItems: "flex-start",
        position: "absolute",
        left: 0
    },
    rightContainer: {
        height: "100%",
        alignItems: "flex-end",
        position: "absolute",
        right: 0
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default ITopBar;