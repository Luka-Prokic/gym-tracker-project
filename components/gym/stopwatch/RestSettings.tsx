import Colors, { Themes } from "../../../constants/Colors";
import { useTheme } from "../../context/ThemeContext";
import useGymActions from "../hooks/useGymActions";
import { GymExercise, useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import ISlide from "@/components/bubbles/ISlide";
import { Text } from "react-native";
import IButton from "@/components/buttons/IButton";
import { Ionicons } from "@expo/vector-icons";
import Container from "@/components/containers/Container";
import HR from "@/components/mis/HR";
import useGetExerciseFullName from "../hooks/useGetExerciseFullName";

interface GymSettingsBubbleProps {
    exerciseId: GymExercise["id"];
    disabled?: boolean;
};

const RestSettings: React.FC<GymSettingsBubbleProps> = ({ exerciseId, disabled }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { layoutId, exercise, settingsVisible, closeSettings, openSettings } = useGymActions(exerciseId);
    const { updateRestLength, updateGymExerciseSettings, updateCardioExerciseSettings, updateSuperSetSettings } = useExerciseLayout();

    if (!exercise)
        return null;

    const restLength = exercise.restLength ?? 0;

    const handleAddTime = () => {
        if (restLength >= 0) {
            updateGymExerciseSettings(layoutId, exerciseId, "noRest", false);
            updateCardioExerciseSettings(layoutId, exerciseId, "noRest", false);
            updateSuperSetSettings(layoutId, exerciseId, "noRest", false);
        }
        updateRestLength(layoutId, exerciseId, restLength + 15);
    }

    const handleSubtractTime = () => {
        if (restLength === 15) {
            updateGymExerciseSettings(layoutId, exerciseId, "noRest", true);
            updateCardioExerciseSettings(layoutId, exerciseId, "noRest", true);
            updateSuperSetSettings(layoutId, exerciseId, "noRest", true);
        }
        updateRestLength(layoutId, exerciseId, restLength ? restLength - 15 : restLength);
    }


    const exerciseName = useGetExerciseFullName(exercise.exId);

    const minutes = String(Math.floor(restLength / 60));
    const seconds = String(restLength % 60).padStart(2, '0');
    const label = exercise.settings.noRest ? "off" : minutes !== "0" ? `${minutes}min ${seconds}s` : `${seconds}s`;

    return (
        <>
            <IButton height={22} width={"80%"} style={{ justifyContent: "flex-start" }} onPress={openSettings} disabled={disabled}>
                <Ionicons name="stopwatch" color={color.grayText} size={22} />
                <Text style={{ fontWeight: "bold", fontSize: 16, color: color.grayText }}>{label}</Text>
            </IButton>
            <ISlide size="small" visible={settingsVisible} onClose={closeSettings}>
                <Text
                    style={{ color: color.tint, fontSize: 16, fontWeight: "bold" }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {exerciseName}
                </Text>
                <Text
                    style={{ color: color.text, fontSize: 24, fontWeight: "bold" }}>
                    Rest Time {label}
                </Text>
                {/* <HR /> */}
                <Container width={"100%"} height={44} direction="row" style={{ gap: "4%", paddingHorizontal: "5%" }}>
                    <IButton color={color.border} height={44} title="-15" width={"48%"}
                        onPress={handleSubtractTime}
                    />
                    <IButton color={color.border} height={44} title="+15" width={"48%"}
                        onPress={handleAddTime}
                    />
                </Container>
            </ISlide>
        </>
    );
}

export default RestSettings;