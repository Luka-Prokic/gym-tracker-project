import React, { useEffect } from "react";
import { useRoutine } from "../../../components/context/RoutineZustand";
import IButton from "../../../components/buttons/IButton";
import { useTheme } from "../../../components/context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Animated } from "react-native";
import useFadeInAnim from "@/assets/animations/useFadeInAnim";

export default function CancelRoutineButton() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const {
        updateRoutine, clearActiveRoutine,
        activeRoutine,
    } = useRoutine();
    const navigation = useNavigation();
    const { fadeIn } = useFadeInAnim();


    const handleCancel = () => {
        setTimeout(() => clearActiveRoutine(), 100);
        if (activeRoutine.status === "saved")
            updateRoutine(activeRoutine.id, activeRoutine);

        navigation.goBack();
    };

    const handleDiscard = () => {
        updateRoutine(activeRoutine.id, { ...activeRoutine, status: "temp" });
        handleCancel();
        // removeLayout(activeRoutine.layoutId);
    };

    return (
        <Animated.View style={fadeIn}>
            <IButton width={44} height={44} onPress={handleDiscard} >
                <Ionicons name="close-circle" size={44} color={color.error} />
            </IButton>
        </Animated.View>
    );
}