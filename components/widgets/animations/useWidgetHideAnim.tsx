import { Animated } from "react-native";

const useWidgetHideAnim = (scaleAnim: Animated.Value) => {

    setTimeout(() => {
        Animated.timing(scaleAnim, {
            toValue: .1,
            useNativeDriver: true,
            duration: 300,
        }).start();
    }, 100);

    return scaleAnim;
};

export default useWidgetHideAnim;