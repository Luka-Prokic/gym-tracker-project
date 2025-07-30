import useGymActions from "../hooks/useGymActions";
import { useExerciseLayout, GymExercise, SuperSet } from "../../context/ExerciseLayoutZustand";
import { StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { View } from "react-native";
import { Sets } from "@/components/context/ExerciseZustand";
import { Ionicons } from "@expo/vector-icons";
import IButton from "@/components/buttons/IButton";

interface SuperSetCellDoneProps {
    exerciseId: GymExercise["id"];
    supersetId: SuperSet["id"];
    index: any;
    set: Sets;
    disabled?: boolean;
};


const SuperSetCellDone: React.FC<SuperSetCellDoneProps> = ({ exerciseId, supersetId, index, set, disabled }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { layoutId, exercise } = useGymActions(exerciseId);
    const { addRest, startRest, getSuperSet } = useExerciseLayout();

    const ss = getSuperSet(layoutId, supersetId);
    if (!exercise || !set || !ss)
        return null;
    const mode = ss.settings.supersetType;

    const toggleCheck = () => {
        if (mode === "circuit") {
            if (!ss.settings?.noRest) {
                startRest(ss.layout[ss.layout.length - 1].id, index, ss.restLength ?? 120);
            }
            ss.layout.map((ex: any) => addRest(layoutId, ex.id, index, 1));
        } else
            if (exercise.settings?.noRest) {
                addRest(layoutId, exerciseId, index, 1);
            } else {
                startRest(exerciseId, index, exercise.restLength ?? 120)
            }

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

export default SuperSetCellDone;