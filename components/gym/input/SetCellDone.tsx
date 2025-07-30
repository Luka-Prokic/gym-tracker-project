import useGymActions from "../hooks/useGymActions";
import { useExerciseLayout, GymExercise } from "../../context/ExerciseLayoutZustand";
import { StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { View } from "react-native";
import { Sets } from "@/components/context/ExerciseZustand";
import { Ionicons } from "@expo/vector-icons";
import IButton from "@/components/buttons/IButton";

interface SetCellDoneInputProps {
    exerciseId: GymExercise["id"];
    index: any;
    set: Sets;
    disabled?: boolean;
};


const SetCellDone: React.FC<SetCellDoneInputProps> = ({ exerciseId, index, set, disabled }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { layoutId, exercise } = useGymActions(exerciseId);
    const { addRest, startRest } = useExerciseLayout();

    if (!exercise || !set)
        return null;

    const toggleCheck = () => {
        if (exercise.settings?.noRest) {
            addRest(layoutId, exerciseId, index, 1);
        } else
            startRest(exerciseId, index, exercise.restLength ?? 120)
    };

    const checked = set.rest !== 0 && set.rest ? true : false;
    const checkColor = checked ? color.secondaryText : color.text;

    return (
        <View
            key={`set-row-${index}-${set.dropSets?.length}`}
            style={styles.cell}
        >

            {set.rest ?
                <Ionicons
                    name="checkbox"
                    size={24}
                    color={checkColor}
                />
                :
                <IButton
                    width={"100%"} height={"100%"}
                    onPress={toggleCheck}
                    disabled={disabled}
                >
                    <Ionicons
                        name="square-outline"
                        size={24}
                        color={checkColor}
                    />
                </IButton>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    cell: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 44,
    },
});

export default SetCellDone;