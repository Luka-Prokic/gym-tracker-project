import { StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { GymExercise } from "../context/ExerciseLayoutZustand";
import { Sets } from "../context/ExerciseZustand";
import LayoutGymTableInput from "./LayoutGymTableInput";
import { useDisplayedWeight } from "@/components/context/user/hooks/filters";
import { useUser } from "@/components/context/UserZustend";
import { View } from "react-native";

interface LayoutDropSetCellInputProps {
    exerciseId: GymExercise["id"];
    setIndex: number;
    dropSetIndex: number;
    dropSet: Sets;
    column: keyof Sets;
    disabled?: boolean;
}

const LayoutDropSetCellInput: React.FC<LayoutDropSetCellInputProps> = ({ 
    exerciseId, 
    setIndex, 
    dropSetIndex, 
    dropSet, 
    column, 
    disabled 
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { fromKg, toKg } = useDisplayedWeight();
    const { settings } = useUser();

    const weightUnit = settings.units.weight;

    const checked = dropSet.rest !== 0 && dropSet.rest ? true : false;
    const checkColor = checked ? color.secondaryText : color.text;

    return (
        <View style={styles.cell}>
            <LayoutGymTableInput
                column={column}
                value={column === "kg" ? fromKg(dropSet[column] as number) : dropSet[column]}
                text={checkColor}
                onChange={(inputValue: any) => {
                    // TODO: Implement drop set update
                    console.log("Update drop set:", { exerciseId, setIndex, dropSetIndex, column, inputValue });
                }}
                editable={disabled}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    cell: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 34,
    },
});

export default LayoutDropSetCellInput;
