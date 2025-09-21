import { Stack, router } from "expo-router";
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from "../components/context/ThemeContext";
import { SettingsNavigationProvider } from "../components/context/SettingsContext";
import Colors, { Themes } from '../constants/Colors';
import MainHeader from "../components/headers/main/MainHeader";
import CancelRoutineButton from "../screens/routine/gym/CancelRoutineButton";
import FinishRoutineButton from "../screens/routine/gym/FinishRoutineButton";
import ITopBar from "../components/headers/ITopBar";
import IButton from "../components/buttons/IButton";
import { Ionicons } from "@expo/vector-icons";

function RootLayoutContent() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const backgroundColor = {
        light: '#FFFFFF',
        peachy: '#FFFFFF',
        oldschool: '#FFFEF6',
        dark: '#1C1C1E',
        preworkout: '#222222',
        Corrupted: '#222222',
    }[theme as Themes];

    const barStyle = theme === 'dark' || theme === 'preworkout' || theme === 'Corrupted' ? 'light-content' : 'dark-content';

    return (
        <SafeAreaProvider>
            <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />
            <View style={{ flex: 1, backgroundColor: color.background }}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen
                        name="routine"
                        options={{
                            presentation: "card",
                            headerShown: true,
                            header: () => <MainHeader
                                navigation={{} as any}
                                route={{ name: 'routine' } as any}
                                options={{
                                    headerLeft: () => <CancelRoutineButton />,
                                    headerRight: () => <FinishRoutineButton />
                                }}
                                scrollY={0}
                            />
                        }}
                    />
                    <Stack.Screen
                        name="routines"
                        options={{
                            header: () => {
                                return <ITopBar
                                    title=""
                                    headerLeft={() => <></>}
                                    headerRight={() => (
                                        <IButton width={34} height={34} onPress={() => router.back()}>
                                            <Ionicons name="close" size={24} color={color.text} />
                                        </IButton>
                                    )}
                                />
                            }
                        }}
                    />
                    <Stack.Screen
                        name="stats"
                          options={{
                            header: () => {
                                return <ITopBar
                                    title=""
                                    headerLeft={() => <></>}
                                    headerRight={() => (
                                        <IButton width={34} height={34} onPress={() => router.back()}>
                                            <Ionicons name="close" size={24} color={color.text} />
                                        </IButton>
                                    )}
                                />
                            }
                        }}
                            />
                    <Stack.Screen
                        name="settings"
                        options={{
                            headerShown: false
                        }}
                    />
                    <Stack.Screen
                        name="modals"
                        options={{
                            headerShown: false
                        }}
                    />
                </Stack>
            </View>
        </SafeAreaProvider>
    );
}

export default function RootLayout() {
    return (
        <SettingsNavigationProvider>
            <ThemeProvider>
                <RootLayoutContent />
            </ThemeProvider>
        </SettingsNavigationProvider>
    );
}