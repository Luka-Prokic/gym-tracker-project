import { useEffect, useRef } from "react";
import { Animated } from "react-native";

const useWobbleAnim = () => {
  const wobbleAnim = useRef(new Animated.Value(0)).current;

  const randomDelay = () => Math.random() * 40 + 1;

  const wobble = Animated.loop(
    Animated.sequence([
      Animated.timing(wobbleAnim, {
        toValue: 0.5,
        duration: 60 + randomDelay(),
        useNativeDriver: true,
      }),
      Animated.timing(wobbleAnim, {
        toValue: -0.5,
        duration: 60 + randomDelay(),
        useNativeDriver: true,
      }),
      Animated.timing(wobbleAnim, {
        toValue: 0,
        duration: 60 + randomDelay(),
        useNativeDriver: true,
      }),
    ])
  );

  wobble.start();

  return wobbleAnim;
};

export default useWobbleAnim;