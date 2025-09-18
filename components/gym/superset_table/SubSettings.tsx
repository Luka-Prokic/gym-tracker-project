import { Ionicons } from "@expo/vector-icons";
import OptionButton from "../../buttons/OptionButton";
import Container from "../../containers/Container";
import Colors, { Themes } from "../../../constants/Colors";
import { useTheme } from "../../context/ThemeContext";
import useGymActions from "../hooks/useGymActions";
import { GymExercise, SuperSet, useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import { router } from "expo-router";

interface SubSettingsBubbleProps {
    exerciseId: GymExercise["id"];
    supersetId: SuperSet["id"];
    onClose: () => void;
};

const SubSettings: React.FC<SubSettingsBubbleProps> = ({ exerciseId, supersetId, onClose }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { layoutId, exercise } = useGymActions(exerciseId);
    const {
        removeFromSuperSet, removeGymExercise, removeSuperSet,
        getSuperSet, updateGymExerciseSettings
    } = useExerciseLayout();

    if (!exercise)
        return null;

    const showRIR = !exercise.settings.noRIR;
    const showRPE = !exercise.settings.noRPE;

    const toggleRIR = () => {
        updateGymExerciseSettings(layoutId, exerciseId, "noRIR", showRIR);
    };
    const toggleRPE = () => {
        updateGymExerciseSettings(layoutId, exerciseId, "noRPE", showRPE);
    };

    const handleRemoveExercise = async () => {
        const ss = getSuperSet(layoutId, supersetId);
        if (ss.layout.length <= 2) {
            ss.layout.map((ex: any) => {
                removeFromSuperSet(layoutId, supersetId, ex.id);
            })
            removeSuperSet(layoutId, supersetId);
        } else {
            removeFromSuperSet(layoutId, supersetId, exerciseId);
        }
    }

    const handleDeleteExercise = async () => {
        const ss = getSuperSet(layoutId, supersetId);
        if (ss.layout.length === 2) {
            handleRemoveExercise();
        }
        removeGymExercise(layoutId, exerciseId);
    }

    return (
        <Container width={"100%"}>
            <OptionButton title={"Remove From Super Set"} color={color.tint} icon={<Ionicons name="close-circle" color={color.tint} size={24} />}
                onPress={() => {
                    handleRemoveExercise();
                    onClose();
                }}
            />
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
            </Container>

            <OptionButton title={"Remove Excercise"} color={color.error} icon={<Ionicons name="remove-circle" color={color.error} size={24} />}
                onPress={() => {
                    handleDeleteExercise();
                    onClose();
                }}
            />
        </Container>
    );
}

export default SubSettings;