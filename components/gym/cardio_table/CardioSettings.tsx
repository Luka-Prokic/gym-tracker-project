import React from "react";
import { Ionicons } from "@expo/vector-icons";
import OptionButton from "../../buttons/OptionButton";
import Container from "../../containers/Container";
import Colors from "../../../constants/Colors";
import { useTheme } from "../../context/ThemeContext";
import { CardioExercise, useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import { useRoutine } from "../../context/RoutineZustand";
import { router } from "expo-router";

interface CardioSettingsProps {
    exerciseId: CardioExercise["id"];
    onClose: () => void;
}

const CardioSettings: React.FC<CardioSettingsProps> = ({ exerciseId, onClose }) => {
    const { theme } = useTheme();
    const color = Colors[theme];
    const { getCardioExercise, removeCardioExercise, updateCardioExerciseSettings } = useExerciseLayout();
    const { activeRoutine } = useRoutine();
    const layoutId = activeRoutine.layoutId;
    const exercise = getCardioExercise(layoutId, exerciseId);

    if (!exercise) return null;


    const showNote = !exercise.settings.noNote;

    const toggleNote = () => {
        updateCardioExerciseSettings(layoutId, exerciseId, "noNote", showNote);
    };

    return (
        <Container width="100%" >
            <OptionButton title={"Add Superset Excercise"} color={color.accent} icon={<Ionicons name="add-circle" color={color.accent} size={24} />}
                onPress={() => {
                    onClose();
                    router.push(`/modals/superSet?layoutId=${layoutId}&exId=${exerciseId}`);
                }} />
            <OptionButton title={"Change Excercise"} color={color.text} icon={<Ionicons name="sync-circle" color={color.text} size={24} />}
                onPress={() => {
                    onClose();
                    router.push(`/modals/swapExercise?layoutId=${layoutId}&exId=${exerciseId}`);
                }} />


            <Container width={"100%"}>
                <OptionButton
                    title={showNote ? "Hide Note Section" : "Show Note Section"}
                    color={showNote ? color.tint : color.text}
                    icon={
                        <Ionicons
                            name={showNote ? "checkmark-circle" : "close-circle"}
                            color={showNote ? color.tint : color.text}
                            size={24}
                        />}
                    onPress={toggleNote}
                />
            </Container>

            <OptionButton
                title="Remove Exercise"
                color={color.error}
                icon={<Ionicons name="remove-circle" color={color.error} size={24} />}
                onPress={() => {
                    onClose();
                    removeCardioExercise(layoutId, exerciseId);
                }}
            />
        </Container>
    );
};

export default CardioSettings;