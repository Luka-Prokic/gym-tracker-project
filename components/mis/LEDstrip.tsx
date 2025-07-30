import React, { useEffect } from "react";
import { Easing, StyleSheet, View } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    interpolateColor,
} from "react-native-reanimated";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";

const LEDstrip = () => {
    const borderAnimation = useSharedValue(0);  // Animation starts at 0
    const { theme } = useTheme();
    const color = Colors[theme as Themes]; // Access theme colors

    // Start the animation loop
    useEffect(() => {
        const randomDelay = () => Math.random() * 200 + 1000;
        borderAnimation.value = withRepeat(
            withTiming(1, { duration: randomDelay(), easing: Easing.ease }), // First half: transition to 0.5
            -1,  // Infinite loop
            true // Reverse the animation after each cycle
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                borderAnimation.value,        // The value of the animation
                [1, 0.5, 0],                  // Input range for interpolation
                [
                    color.accent,  // Color at 0
                    color.grayText, // Color at 0.5
                    color.primaryBackground     // Color at 1
                ]
            ),
        };
    });

    return <Animated.View style={[styles.placeholder, animatedStyle]} />;
};

const styles = StyleSheet.create({
    placeholder: {
        width: "42%",
        margin: "4%",
        aspectRatio: 1,
        borderRadius: 16,
        opacity: 0.1,
    },
});

export default LEDstrip;