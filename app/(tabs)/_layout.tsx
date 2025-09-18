import React from "react";
import { Tabs } from "expo-router";
import Colors, { Themes } from "../../constants/Colors";
import { useTheme } from "../../components/context/ThemeContext";
import CakaIcon from "../../components/mis/CakaIcon";
import IProfileBar from "../../components/headers/IProfileBar";
import MainHeader from "../../components/headers/main/MainHeader";

export default function TabLayout() {
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
        <Tabs
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
            <Tabs.Screen
                name="index"
                options={{
                    title: "Corrupt",
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
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: true,
                    header: () => <IProfileBar />,
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
        </Tabs>
    );
}
