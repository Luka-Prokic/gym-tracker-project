import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

const useFlickerAnim = () => {
  const flickerAnim = useRef(new Animated.Value(1)).current;
  const flickerActive = useRef(false);

  useEffect(() => {
    flickerActive.current = true;

    const flickerBurst = () => {
      if (!flickerActive.current) return;

      const flickCount = Math.floor(Math.random() * 5) + 1;
      const flickerSequence = [];

      for (let i = 0; i < flickCount; i++) {
        flickerSequence.push(
          Animated.timing(flickerAnim, {
            toValue: Math.random() > 0.5 ? 0.2 : 1,
            duration: Math.random() * 40 + 10,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        );
      }

      flickerSequence.push(
        Animated.timing(flickerAnim, {
          toValue: Math.random() > 0.8 ? 0.2 : 1,
          duration: Math.random() * 50 + 50,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );

      Animated.sequence(flickerSequence).start(() => {
        if (!flickerActive.current) return;
        const nextDelay = Math.random() * 2800 + 2200;
        setTimeout(flickerBurst, nextDelay);
      });
    };

    flickerBurst();

    return () => {
      flickerActive.current = false;
      flickerAnim.stopAnimation(() => flickerAnim.setValue(1));
    };
  }, [flickerAnim]);

  return flickerAnim;
};

export default useFlickerAnim;