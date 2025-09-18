import React from "react";
import { Stack, router } from "expo-router";
import { View } from "react-native";
import ITopBar from "../../components/headers/ITopBar";
import ExerciseCreateButton from "../../components/gym/selector/ExerciseCreateButton";
import IButton from "../../components/buttons/IButton";
import { Ionicons } from "@expo/vector-icons";
import Colors, { Themes } from "../../constants/Colors";
import { useTheme } from "../../components/context/ThemeContext";

export default function ModalsLayout() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const CloseButton = () => (
        <IButton width={34} height={34} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={color.text} />
        </IButton>
    );

    return (
        <Stack>
            <Stack.Screen
                name="editLayout"
                options={{ 
                    presentation: "modal",
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="all"
                options={{ 
                    presentation: "modal",
                    header: () => <ITopBar 
                        title="All" 
                        headerLeft={() => <></>}
                        headerRight={() => <CloseButton />}
                    />
                }}
            />
            <Stack.Screen
                name="editProfile"
                options={{ 
                    presentation: "modal",
                    header: () => <ITopBar 
                        title="Edit Profile" 
                        headerLeft={() => <></>}
                        headerRight={() => <CloseButton />}
                    />
                }}
            />
            <Stack.Screen
                name="addExercise"
                options={{
                    presentation: "modal",
                    header: () => <ITopBar 
                        title="Add Exercise" 
                        headerLeft={() => <></>}
                        headerRight={() => (
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                <ExerciseCreateButton />
                                <CloseButton />
                            </View>
                        )}
                    />
                }}
            />
            <Stack.Screen
                name="swapExercise"
                options={{ 
                    presentation: "modal",
                    header: () => <ITopBar 
                        title="Swap Exercise" 
                        headerLeft={() => <></>}
                        headerRight={() => <CloseButton />}
                    />
                }}
            />
            <Stack.Screen
                name="superSet"
                options={{ 
                    presentation: "modal",
                    header: () => <ITopBar 
                        title="Super Set" 
                        headerLeft={() => <></>}
                        headerRight={() => <CloseButton />}
                    />
                }}
            />
        </Stack>
    );
}
