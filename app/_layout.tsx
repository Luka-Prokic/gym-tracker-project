import React from "react";
import { ThemeProvider } from "../components/context/ThemeContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../assets/types";
import TabNavigator from "./INavigation";
import ModalNavigator from "./ModalNavigator";
import { SettingsNavigationProvider } from "../components/context/SettingsContext";
import SettingsModal from "../screens/settings/SettingsModal";

const RootStack = createNativeStackNavigator<RootStackParamList>();

const Layout = () => {
    return (
        <SettingsNavigationProvider>
            <ThemeProvider>
                <RootStack.Navigator
                    screenOptions={{ headerShown: false }}
                    initialRouteName="Main"
                >
                    <RootStack.Screen name="Main" component={TabNavigator} />
                    <RootStack.Screen name="Modals" component={ModalNavigator} />
                    <RootStack.Screen name="Settings" component={SettingsModal}
                        options={{ presentation: "modal" }} />
                </RootStack.Navigator>
            </ThemeProvider>
        </SettingsNavigationProvider>
    );
};

export default Layout;