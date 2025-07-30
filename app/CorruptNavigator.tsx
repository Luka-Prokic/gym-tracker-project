import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CorruptParamList } from "../assets/types";
import GymScreen from "../screens/routine/gym/GymScreen";
import ActivityScreen from "../screens/routine/ActivityScreen";
import MainHeader from "../components/headers/main/MainHeader";
import HomeScreen from "../screens/corrupt/HomeScreen";
import CancelRoutineButton from "@/screens/routine/gym/CancelRoutineButton";
import FinishRoutineButton from "@/screens/routine/gym/FinishRoutineButton";
import StatsScreen from "@/screens/routine/StatsScreen";

const CorruptStack = createNativeStackNavigator<CorruptParamList>();

interface CorruptNavigatorProps {
  scrollY: number;
}

const CorruptNavigator: React.FC<CorruptNavigatorProps> = ({ scrollY }) => {
  return (
    <CorruptStack.Navigator
      screenOptions={{
        header: (props) => <MainHeader {...props} scrollY={scrollY} />,
      }}
    >
      <CorruptStack.Screen name="Home" component={HomeScreen} />
      <CorruptStack.Screen name="Routine" component={GymScreen}
        options={{
          presentation: "card",
          headerLeft: () => <CancelRoutineButton />,
          headerRight: () => <FinishRoutineButton />,
        }}
      />
      <CorruptStack.Screen name="Routines" component={ActivityScreen}
        options={{
          presentation: "modal",
          headerLeft: () => <></>,
          headerRight: () => <></>,
        }}
      />
      <CorruptStack.Screen name="Stats" component={StatsScreen}
        options={{
          presentation: "card",
          headerLeft: () => <></>,
        }}
      />
    </CorruptStack.Navigator >
  );
};

export default CorruptNavigator;
