import React from "react";
import { useRoutine } from "../../../components/context/RoutineZustand";
import IButton from "../../../components/buttons/IButton";
import { useTheme } from "../../../components/context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { router } from "expo-router";
import { useExerciseLayout } from "@/components/context/ExerciseLayoutZustand";
import { Ionicons } from "@expo/vector-icons";
import useFadeInAnim from "@/assets/animations/useFadeInAnim";
import { Animated } from "react-native";

export default function FinishRoutineButton() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const {
        updateRoutine, clearActiveRoutineOnly, saveIt,
        activeRoutine,
    } = useRoutine();
    const { getLayout } = useExerciseLayout();
    const { fadeIn } = useFadeInAnim();

    const handleCancel = () => {
        setTimeout(() => clearActiveRoutineOnly(), 100);
        if (activeRoutine.status === "routine")
            updateRoutine(activeRoutine.id, activeRoutine);

        router.back();
    };

    const handleFinish = () => {
        updateRoutine(activeRoutine.id, { ...activeRoutine, isFinished: true });
        saveIt(activeRoutine.id);
        setTimeout(() => clearActiveRoutineOnly(), 100);
        router.back();
    };

    return (
        <Animated.View style={fadeIn}>
            {getLayout(activeRoutine.layoutId)?.layout.length ?
                <IButton width={44} height={44} title="Finish" onPress={handleFinish} >
                    <Ionicons name="checkmark-circle" size={44} color={color.text} />
                </IButton>
                : null}
        </Animated.View>
    );
}