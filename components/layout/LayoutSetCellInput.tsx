import useLayoutGymActions from "./hooks/useLayoutGymActions";
import { useExerciseLayout, GymExercise } from "../context/ExerciseLayoutZustand";
import { StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { View } from "react-native";
import { Sets } from "../context/ExerciseZustand";
import LayoutGymTableInput from "./LayoutGymTableInput";
import { useDisplayedWeight } from "@/components/context/user/hooks/filters";
import { useUser } from "@/components/context/UserZustend";

interface LayoutSetCellInputProps {
    exerciseId: GymExercise["id"];
    index: any;
    set: Sets;
    column: keyof Sets;
    disabled?: boolean;
};

const LayoutSetCellInput: React.FC<LayoutSetCellInputProps> = ({ exerciseId, index, set, column, disabled }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { columns, layoutId, exercise } = useLayoutGymActions(exerciseId);
    const { updateColumn } = useExerciseLayout();
    const { fromKg, toKg } = useDisplayedWeight();
    const { settings } = useUser();

    const weightUnit = settings.units.weight;

    if (!exercise || !set)
        return null;

    const checked = set.rest !== 0 && set.rest ? true : false;
    const checkColor = checked ? color.secondaryText : color.text;

    return (
        <View
            key={`set-cell-${column}-${set.dropSets?.length}-${weightUnit}`}
            style={styles.cell}
        >
            {columns.includes(column) && (
                <LayoutGymTableInput
                    column={column}
                    value={column === "kg" ? fromKg(set[column] as number) : set[column]}
                    text={checkColor}
                    onChange={(inputValue: any) =>
                        updateColumn(
                            layoutId,
                            exercise.id,
                            index,
                            column,
                            column === "kg" ? toKg(inputValue) : inputValue
                        )}
                    editable={disabled}
                />
            )}
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

export default LayoutSetCellInput;
