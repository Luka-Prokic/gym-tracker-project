import { Stack, router } from "expo-router";
import { useTheme } from "../../components/context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import IButton from "../../components/buttons/IButton";
import SettingsHeader from "../../components/headers/SettingsHeader";

export default function SettingsLayout() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const rightExit = () => {
        return (
            <IButton width={34} height={34} onPress={() => {
                router.back();
            }}>
                <Ionicons name="close" size={26} color={color.text} />
            </IButton>
        );
    };

    const header = (props: any) => { 
        return <SettingsHeader 
            title={props.options?.title || props.route?.name}
            headerLeft={props.options?.headerLeft}
            headerRight={props.options?.headerRight}
        /> 
    };

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    header: header,
                    headerRight: rightExit,
                    headerLeft: () => (<></>),
                }}
            />
            <Stack.Screen 
                name="account" 
                options={{
                    header: header,
                    headerRight: rightExit,
                }}
            />
            <Stack.Screen 
                name="measurements" 
                options={{
                    header: header,
                    headerRight: rightExit,
                }}
            />
            <Stack.Screen 
                name="notifications" 
                options={{
                    header: header,
                    headerRight: rightExit,
                }}
            />
            <Stack.Screen 
                name="units" 
                options={{
                    header: header,
                    headerRight: rightExit,
                }}
            />
            <Stack.Screen 
                name="goals" 
                options={{
                    header: header,
                    headerRight: rightExit,
                }}
            />
            <Stack.Screen 
                name="awards" 
                options={{
                    header: header,
                    headerRight: rightExit,
                }}
            />
            <Stack.Screen 
                name="privacy" 
                options={{
                    header: header,
                    headerRight: rightExit,
                }}
            />
        </Stack>
    );
}
