import { Ionicons } from "@expo/vector-icons";
import OptionButton from "../../buttons/OptionButton";
import Container from "../../containers/Container";
import Colors, { Themes } from "../../../constants/Colors";
import { useTheme } from "../../context/ThemeContext";
import useGymActions from "../hooks/useGymActions";
import { GymExercise, useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import { router } from "expo-router";

interface GymSettingsBubbleProps {
    exerciseId: GymExercise["id"];
    onClose: () => void;
};

const GymSettings: React.FC<GymSettingsBubbleProps> = ({ exerciseId, onClose }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { layoutId, exercise } = useGymActions(exerciseId);
    const { removeGymExercise, updateGymExerciseSettings } = useExerciseLayout();

    if (!exercise)
        return null;

    const showRIR = !exercise.settings.noRIR;
    const showRPE = !exercise.settings.noRPE;
    const showNote = !exercise.settings.noNote;

    const toggleRIR = () => {
        updateGymExerciseSettings(layoutId, exerciseId, "noRIR", showRIR);
    };
    const toggleRPE = () => {
        updateGymExerciseSettings(layoutId, exerciseId, "noRPE", showRPE);
    };
    const toggleNote = () => {
        updateGymExerciseSettings(layoutId, exerciseId, "noNote", showNote);
    };

    return (
        <Container width={"100%"}>
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
                    title={showRIR ? "Hide RIR" : "Show RIR"}
                    color={showRIR ? color.tint : color.text}
                    icon={
                        <Ionicons
                            name={showRIR ? "checkmark-circle" : "close-circle"}
                            color={showRIR ? color.tint : color.text}
                            size={24}
                        />
                    }
                    onPress={toggleRIR}
                />
                <OptionButton
                    title={showRPE ? "Hide RPE" : "Show RPE"}
                    color={showRPE ? color.tint : color.text}
                    icon={
                        <Ionicons
                            name={showRPE ? "checkmark-circle" : "close-circle"}
                            color={showRPE ? color.tint : color.text}
                            size={24}
                        />
                    }
                    onPress={toggleRPE}
                />
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
            <OptionButton title={"Remove Excercise"} color={color.error} icon={<Ionicons name="remove-circle" color={color.error} size={24} />}
                onPress={() => {
                    onClose();
                    removeGymExercise(layoutId, exerciseId);
                }}
            />
        </Container>
    );
}

export default GymSettings;