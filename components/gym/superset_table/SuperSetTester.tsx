import { Ionicons } from "@expo/vector-icons";
import OptionButton from "../../buttons/OptionButton";
import Colors, { Themes } from "../../../constants/Colors";
import { useTheme } from "../../context/ThemeContext";
import useGymActions from "../hooks/useGymActions";
import { GymExercise, SuperSet, useExerciseLayout } from "../../context/ExerciseLayoutZustand";

interface SubSettingsBubbleProps {
    exerciseId: GymExercise["id"];
    supersetId?: SuperSet["id"];
};

const SuperSetTester: React.FC<SubSettingsBubbleProps> = ({ exerciseId, supersetId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { layoutId, exercise, exerciseName } = useGymActions(exerciseId);
    const { removeGymExercise } = useExerciseLayout();

    if (!exercise)
        return null;
    return (

        <OptionButton title={exerciseName} color={color.error} icon={<Ionicons name="remove-circle" color={color.error} size={24} />}
            onPress={() => {
                removeGymExercise(layoutId, exerciseId);
            }}
        />
    );
}

export default SuperSetTester;