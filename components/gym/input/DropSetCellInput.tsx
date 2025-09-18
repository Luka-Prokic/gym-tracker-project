import useGymActions from "../hooks/useGymActions";
import { useExerciseLayout, GymExercise } from "../../context/ExerciseLayoutZustand";
import { StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { View } from "react-native";
import { DropSets, Sets } from "@/components/context/ExerciseZustand";
import GymTableInput from "../gym_table/GymTableInput";
import { useUser } from "@/components/context/UserZustend";
import { useDisplayedWeight } from "@/components/context/user/hooks/filters";

interface DropSetCellInputProps {
    exerciseId: GymExercise["id"];
    setIndex: any;
    dropSetIndex: any;
    dropSet: DropSets;
    column: "reps" | "kg";
    disabled?: boolean;
};


const DropSetCellInput: React.FC<DropSetCellInputProps> = ({ exerciseId, setIndex, dropSetIndex, dropSet, column, disabled }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { layoutId } = useGymActions(exerciseId);
    const { updateDropColumn } = useExerciseLayout();
    const { settings } = useUser();
    const { fromKg, toKg } = useDisplayedWeight();

    const weightUnit = settings.units.weight;

    if (!dropSet)
        return null;

    return (
        <View
            key={`drop-set-cell-${column}-${weightUnit}`}
            style={styles.cell}
        >
            <GymTableInput
                column={column}
                value={column === "kg" ? fromKg(dropSet[column] as number) : dropSet[column]}
                text={color.secondaryText}
                height={34}
                onChange={(inputValue) =>
                    updateDropColumn(
                        layoutId,
                        exerciseId,
                        setIndex,
                        dropSetIndex,
                        column,
                        column === "kg" ? toKg(inputValue) : inputValue
                    )}
                editable={disabled}
            />
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

export default DropSetCellInput;