import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Colors, { Themes } from "../../constants/Colors";
import { useTheme } from "../../components/context/ThemeContext";

interface IBackButton {
    color?: string;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const BackButton: React.FC<IBackButton> = ({ color }) => {
    const { theme } = useTheme();
    const colors = Colors[theme as Themes];

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
        <AnimatedTouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { opacity: fadeAnim }]}
            hitSlop={styles.hitSlop}
        >
            <Ionicons name="chevron-back" size={24} color={color || colors.text} />
        </AnimatedTouchableOpacity>
    );
};

const styles = StyleSheet.create({
    backButton: {
        position: "absolute",
        top: 0,
        left: 0,
        height: 34,
        width: 44,
        paddingLeft: 16,
        paddingRight: 4,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
    },
    hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
});

export default BackButton;
