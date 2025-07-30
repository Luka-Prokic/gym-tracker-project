import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import IButton from "../buttons/IButton";
import Colors, { Themes } from "../../constants/Colors";
import hexToRGBA from "../../assets/hooks/HEXtoRGB";
import { useTheme } from "../context/ThemeContext";

const SettingsHeader: React.FC<NativeStackHeaderProps> = ({
    navigation,
    route,
    options,
    back,
}) => {
    const { theme } = useTheme();
    const title = options.title || route.name;
    const color = Colors[theme as Themes];

    return (
        <View style={styles.header}>
            <View style={styles.leftContainer}>
                {options.headerLeft ? null : (
                    <IButton width={34} height={34} onPress={navigation.goBack}>
                        <FontAwesome name="angle-left" size={26} color={color.tint} />
                    </IButton>
                )}
            </View>
            <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: color.text }]}>{title}</Text>
            </View>
            <View style={styles.rightContainer}>
                {options.headerRight ? options.headerRight({ tintColor: color.text }) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 34,
        backgroundColor: hexToRGBA(Colors.light.primaryBackground, 0.1),
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 0,
        backdropFilter: "blur(10px",
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