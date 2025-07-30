import { useEffect, useRef } from "react";
import { Animated } from "react-native";



const useFadeInAnim = (trigger?: any) => {

    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(opacityAnim,
            {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start();
    }, [trigger]);

    const fadeIn = {
        opacity: opacityAnim.interpolate({
            inputRange: [0, 0.4, 1],
            outputRange: [0, 0.8, 1],
        }),
    };

    return {
        fadeIn
    };
};

export default useFadeInAnim;