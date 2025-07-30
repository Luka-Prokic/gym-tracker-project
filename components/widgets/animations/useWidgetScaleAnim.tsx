import { useEffect, useRef } from "react";
import { Animated } from "react-native";

const useWidgetScaleAnim = (modalVisible: boolean) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (modalVisible) {
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        useNativeDriver: true,
        speed: 1,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        duration: 300,
      }).start();
    }
  }, [modalVisible]);

  return scaleAnim;
};

export default useWidgetScaleAnim;