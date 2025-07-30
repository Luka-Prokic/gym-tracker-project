import React from "react";
import { useRoutine } from "../../../components/context/RoutineZustand";
import IButton from "../../../components/buttons/IButton";
import { useTheme } from "../../../components/context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { useExerciseLayout } from "@/components/context/ExerciseLayoutZustand";
import { Ionicons } from "@expo/vector-icons";
import useFadeInAnim from "@/assets/animations/useFadeInAnim";
import { Animated } from "react-native";

export default function FinishRoutineButton() {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const {
        updateRoutine, clearActiveRoutine, saveIt,
        activeRoutine,
    } = useRoutine();
    const { getLayout } = useExerciseLayout();
    const navigation = useNavigation();
    const { fadeIn } = useFadeInAnim();

    const handleCancel = () => {
        setTimeout(() => clearActiveRoutine(), 100);
        if (activeRoutine.status === "saved")
            updateRoutine(activeRoutine.id, activeRoutine);

        navigation.goBack();
    };

    const handleFinish = () => {
        saveIt(activeRoutine.id);
        updateRoutine(activeRoutine.id, { ...activeRoutine, status: "saved" });
        handleCancel();
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