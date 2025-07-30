import { Animated } from "react-native";
import { useProgressPercentage } from "../hooks/useProgressPrecentage";
import { useEffect, useState } from "react";

export function useProgressAnim(current: number, max: number) {
    const [progressAnim] = useState(new Animated.Value(0));
    const progress = useProgressPercentage(current, max);

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 100,
            useNativeDriver: true,
        }).start();
    }, [progress]);

    return progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });
}
