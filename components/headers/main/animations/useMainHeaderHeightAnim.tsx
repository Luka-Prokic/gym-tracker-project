import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useTheme } from "../../../context/ThemeContext";

const useMainHeaderHeightAnim = () => {
    const { homeEditing } = useTheme();
    const heightAnim = useRef(new Animated.Value(homeEditing ? 44 : 64)).current;

    useEffect(() => {
        Animated.spring(heightAnim, {
            toValue: homeEditing ? 44 : 88,
            speed: 1,
            useNativeDriver: true,
        }).start();
    }, [homeEditing, heightAnim]);

    return heightAnim;
};

export default useMainHeaderHeightAnim;
