import React from "react";
import { View, StyleSheet } from "react-native";
import BackButton from "../../components/buttons/BackButton";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

interface ITopBarProps extends NativeStackHeaderProps {
    children?: React.ReactNode;
}

const ITopBar: React.FC<ITopBarProps> = ({ children, options }) => {
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
                {options.headerLeft ? null : (
                    <BackButton />
                )}
            </View>
            <View style={styles.center}>{children}</View>
            <View style={styles.rightContainer}
            >
                {options.headerRight ? options.headerRight({ tintColor: color.text }) :
                    <></>
                }
            </View>
        </View >
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
});

export default ITopBar;