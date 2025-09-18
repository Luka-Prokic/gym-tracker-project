import React from "react";
import { View } from "react-native";
import HomeScreen from "../screens/corrupt/HomeScreen";
import MainHeader from "../components/headers/main/MainHeader";

interface CorruptNavigatorProps {
  scrollY: number;
}

const CorruptNavigator: React.FC<CorruptNavigatorProps> = ({ scrollY }) => {
  return (
    <View style={{ flex: 1 }}>
      <MainHeader 
        navigation={{} as any} 
        route={{ name: 'home' } as any}
        options={{ headerLeft: undefined, headerRight: undefined }} 
        scrollY={scrollY} 
      />
      <HomeScreen />
    </View>
  );
};

export default CorruptNavigator;
