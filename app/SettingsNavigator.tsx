import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingsParamList } from "../assets/types";
import AccountScreen from "../screens/settings/account/AccountScreen";
import MeasurementsScreen from "../screens/settings/app/MeasurementsScreen";
import NotificationsScreen from "../screens/settings/app/NotificationsScreen";
import UnitsScreen from "../screens/settings/app/UnitsScreen";
import GoalsScreen from "../screens/settings/app/GoalsScreen";
import AwardsScreen from "../screens/settings/app/AwardsScreen";
import PrivacyProtectionScreen from "../screens/settings/account/PrivacyProtectionScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import { SettingsNavigationContext } from "../components/context/SettingsContext";
import { useTheme } from "../components/context/ThemeContext";
import Colors, { Themes } from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import IButton from "../components/buttons/IButton";
import SettingsHeader from "../components/headers/SettingsHeader";

const SettingsStack = createNativeStackNavigator<SettingsParamList>();

const SettingsNavigator: React.FC = () => {
  const { theme } = useTheme();
  const color = Colors[theme as Themes];
  const { exitModal } = useContext(SettingsNavigationContext);

  const rightExit = () => {
    return (
      <IButton width={34} height={34} onPress={exitModal}>
        <Ionicons name="close" size={26} color={color.text} />
      </IButton>
    );
  }

  const header = (props: any) => { return <SettingsHeader {...props} /> };

  return (
    <SettingsStack.Navigator
      screenOptions={{
        header: header,
        headerRight: rightExit,
      }}
    >
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={() => ({
          headerLeft: () => (<></>),
        })}
      />
      <SettingsStack.Screen name="Account" component={AccountScreen} />
      <SettingsStack.Screen name="Measurements" component={MeasurementsScreen} />
      <SettingsStack.Screen name="Notifications" component={NotificationsScreen} />
      <SettingsStack.Screen name="Units" component={UnitsScreen} />
      <SettingsStack.Screen name="Goals" component={GoalsScreen} />
      <SettingsStack.Screen name="Awards" component={AwardsScreen} />
      <SettingsStack.Screen name="Privacy" component={PrivacyProtectionScreen} />
    </SettingsStack.Navigator>
  );
};

export default SettingsNavigator;
