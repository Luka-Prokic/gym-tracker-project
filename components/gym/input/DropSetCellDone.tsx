import useGymActions from "../hooks/useGymActions";
import { useExerciseLayout, GymExercise } from "../../context/ExerciseLayoutZustand";
import { StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { View } from "react-native";
import IButton from "@/components/buttons/IButton";
import { Ionicons } from "@expo/vector-icons";

interface DropSetCellDoneProps {
    exerciseId: GymExercise["id"];
    setIndex: any;
    dropSetIndex: any;
    disabled: boolean;
};


const DropSetCellDone: React.FC<DropSetCellDoneProps> = ({ exerciseId, setIndex, dropSetIndex, disabled }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { layoutId, exercise } = useGymActions(exerciseId);
    const { removeDropSet } = useExerciseLayout();

    if (!exercise)
        return null;

    return (
        <View
            key={`drop-set-cell-done-${setIndex}`}
            style={styles.cell}
        >
            <IButton
                width={"100%"} height={"100%"}
                onPress={() => { removeDropSet(layoutId, exerciseId, setIndex, dropSetIndex) }}
                disabled={disabled}
            >
                <Ionicons
                    name="close-circle"
                    size={24}
                    color={color.secondaryText}
                />
            </IButton>
        </View>
    );
}

const styles = StyleSheet.create({
    cell: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 34,
    },
});

export default DropSetCellDone;