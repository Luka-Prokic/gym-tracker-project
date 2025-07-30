import { useTheme } from "../../components/context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { View, ScrollView, Animated } from "react-native";
import ITrainingBar from "../../components/headers/ITrainingBar";
import CorruptNavigator from "../../app/CorruptNavigator";

export default function CorruptScreen() {
  const { theme, homeEditing } = useTheme();
  const color = Colors[theme as Themes];

  const [scrollY, setScrollY] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = useCallback((event: any) => {
    setScrollY(event.nativeEvent.contentOffset.y);
  }, []);

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  useEffect(() => {
    if (homeEditing)
      scrollToTop();
  }, [homeEditing]);

  return (
    <View style={{
      flex: 1,
      backgroundColor: color.background
    }}>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        bounces={true}
      >

        <CorruptNavigator scrollY={scrollY} />

      </ScrollView>

      <ITrainingBar scrollY={scrollY} />

    </View>
  );
};