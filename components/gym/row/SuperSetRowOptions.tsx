import { GymExercise, LayoutItem, SuperSet, useExerciseLayout } from "@/components/context/ExerciseLayoutZustand";
import { useTheme } from "@/components/context/ThemeContext";
import Colors, { Themes } from "@/constants/Colors";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import useGymActions from "../hooks/useGymActions";
import { Sets } from "@/components/context/ExerciseZustand";
import { StyleSheet } from "react-native";
import { isCardioExercise, isGymExercise } from "@/components/context/utils/GymUtils";


interface SuperSetRowOptionsProps {
    exerciseId: LayoutItem["id"];
    supersetId: SuperSet["id"];
    index: number;
    set: Sets;
    closeSettings: () => void;
};

const SuperSetRowOptions: React.FC<SuperSetRowOptionsProps> = ({ exerciseId, supersetId, index, set, closeSettings }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];

    const { layoutId } = useGymActions(exerciseId);
    const { addRest, addDropSet, removeSet, removeInterval, getSuperSet } = useExerciseLayout();

    const ss = getSuperSet(layoutId, supersetId);
    if (!ss)
        return null;
    const mode = ss.settings.supersetType;

    const deleteRow = () => {
        if (mode === "circuit") {
            ss.layout.map((ex: LayoutItem) => {
                if (isGymExercise(ex)) return removeSet(layoutId, ex.id, index)
                if (isCardioExercise(ex)) return removeInterval(layoutId, ex.id, index)
            });
        } else {
            return removeSet(layoutId, exerciseId, index)
        }
    };

    const addNewDropSet = () => {

        // if (mode === "circuit") {
        //     ss.layout.map((ex: any) => addDropSet(layoutId, ex.id, index));
        // } else {
        addDropSet(layoutId, exerciseId, index);
        // }
    };

    const unCheck = () => {
        if (mode === "circuit") {
            ss.layout.map((ex: any) => addRest(layoutId, ex.id, index, 0));
        } else {
            addRest(layoutId, exerciseId, index, 0);
        }
        closeSettings();
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
            onPress={deleteRow}
        >
            <Text
                style={styles.optionText}
            >
                Delete
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: color.fifthBackground }]}
            onPress={addNewDropSet}
        >
            <Text
                style={[styles.optionText, { color: color.secondaryText }]}
            >
                Drop Set
            </Text>
        </TouchableOpacity>
        {checked ? <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: checkBackground }]}
            onPress={unCheck}
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

export default SuperSetRowOptions;