import { useRef } from "react";
import { Animated } from "react-native";

const useBounceScaleAnim = () => {

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const bounceIt = () => {

        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 10,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                speed: 2,
                bounciness: 10,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const bounceAnim = {
        transform: [{ scale: scaleAnim }]
    };

    return {
        bounceAnim,
        bounceIt
    };
};

export default useBounceScaleAnim;