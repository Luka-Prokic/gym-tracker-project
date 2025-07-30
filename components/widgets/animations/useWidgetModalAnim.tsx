import { useEffect, useRef } from "react";
import { Animated } from "react-native";

const useWidgetModalAnim = (modalVisible: boolean) => {
  const modalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(modalAnim, {
        toValue: 1,
        useNativeDriver: true,
        duration: 400,
      }).start();
    } else {
      Animated.timing(modalAnim, {
        toValue: 0.2,
        useNativeDriver: true,
        duration: 300,
      }).start();
    }
  }, [modalVisible]);

  return modalAnim;
};

export default useWidgetModalAnim;