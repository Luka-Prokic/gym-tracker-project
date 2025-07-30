import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "../screens/ProfileScreen";
import Colors, { Themes } from "../constants/Colors";
import { useTheme } from "../components/context/ThemeContext";
import CakaIcon from "../components/mis/CakaIcon";
import { HomeParamList } from "../assets/types";
import IProfileBar from "../components/headers/IProfileBar";
import CorruptScreen from "../screens/corrupt/CorruptScreen";

const Tab = createBottomTabNavigator<HomeParamList>();

export default function TabNavigator() {
    const { theme } = useTheme();
    const colors = Colors[theme as Themes];

    const backgroundColor = {
        light: "rgba(255, 255, 255, 0.2)", // #FFFFFF
        oldschool: "rgba(255, 254, 246, 0.2)", // #FFFEF6
        dark: "rgba(100, 100, 100, 0.2)", // #646464
        preworkout: "rgba(255, 254, 246, 0.2)", // #FFFEF6
        Corrupted: "rgba(255, 255, 255, 0.666)", // #FFFFFF
        peachy: "rgba(255, 204, 173, 0.2)", // 
    }[theme as Themes];

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelPosition: "below-icon",
                tabBarInactiveTintColor: "#858589",
                tabBarStyle: {
                    backgroundColor: backgroundColor,
                    borderTopWidth: 0,
                    position: "absolute",
                    height: 64,
                    backdropFilter: 'blur(10px)',
                },
                tabBarLabelStyle: {
                    fontWeight: "bold",
                    fontSize: 10,
                },
            }}
        >
            <Tab.Screen
                name="Corrupt"
                component={CorruptScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <CakaIcon
                            name="caka-icon"
                            size={24}
                            stroke={focused ? "none" : color}
                            fill={focused ? colors.tabIconHomeSelected : "none"}
                        />
                    ),
                    tabBarActiveTintColor: colors.tabIconHomeSelected,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    header: (() => <IProfileBar />),
                    tabBarIcon: ({ color, focused }) => (
                        <CakaIcon
                            name="circle-icon"
                            size={26}
                            stroke={focused ? colors.tabIconProfileSelected : color}
                        />
                    ),
                    tabBarActiveTintColor: colors.tabIconProfileSelected,
                }}
            />
        </Tab.Navigator>
    );
}