import { GymExercise, useExerciseLayout } from "@/components/context/ExerciseLayoutZustand";
import { useTheme } from "@/components/context/ThemeContext";
import Colors, { Themes } from "@/constants/Colors";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import useGymActions from "../hooks/useGymActions";
import { Sets } from "@/components/context/ExerciseZustand";
import { StyleSheet } from "react-native";


interface GymRowOptionsProps {
    exerciseId: GymExercise["id"];
    index: number;
    set: Sets;
    closeSettings: () => void;
};

const GymRowOptions: React.FC<GymRowOptionsProps> = ({ exerciseId, index, set, closeSettings }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const { layoutId } = useGymActions(exerciseId);
    const { addRest, addDropSet, removeSet } = useExerciseLayout();

    const deleteRow = (rowId: number) => {
        removeSet(layoutId, exerciseId, rowId);
    };

    const checked = set.rest !== 0 && set.rest ? true : false;
    const checkBackground = index % 2 === 1
        ?
        color.secondaryBackground
        :
        color.primaryBackground;

    return (<>
        <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: color.error }]}
            onPress={() => deleteRow(index)}
        >
            <Text
                style={[styles.optionText, { color: color.secondaryText }]}
            >
                Delete
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: color.fifthBackground }]}
            onPress={() => addDropSet(layoutId, exerciseId, index)}
        >
            <Text
                style={[styles.optionText, { color: color.secondaryText }]}
            >
                Drop Set
            </Text>
        </TouchableOpacity>
        {checked ? <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: checkBackground }]}
            onPress={() => { addRest(layoutId, exerciseId, index, 0); closeSettings() }}
        >
            <Text
                style={[styles.optionText, { color: color.accent }]}
            >
                UnCheck
            </Text>
        </TouchableOpacity> : null}
    </>)
};


const styles = StyleSheet.create({
    optionButton: {
        width: "25%",
        height: 44,
        alignItems: "center",
        justifyContent: "center",

    },
    optionText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default GymRowOptions;