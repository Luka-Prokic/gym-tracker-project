import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors, { Themes } from "../../../constants/Colors";
import { useTheme } from "../../../components/context/ThemeContext";
import { Text } from "react-native";

interface ExerciseCreateButtonProps {
    color?: string;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ExerciseCreateButton: React.FC<ExerciseCreateButtonProps> = ({ color }) => {
    const navigation = useNavigation();
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
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { opacity: fadeAnim }]}
            hitSlop={styles.hitSlop}
        >
            <Text style={{ color: color ? color : colors.text, fontSize: 16 }} >
                Create
            </Text>
        </AnimatedTouchableOpacity >
    );
};

const styles = StyleSheet.create({
    backButton: {
        height: 34,
        paddingLeft: 4,
        paddingRight: 16,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
    },
    hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
});

export default ExerciseCreateButton;
