import useGymActions from "../hooks/useGymActions";
import { useExerciseLayout, GymExercise, SuperSet } from "../../context/ExerciseLayoutZustand";
import { StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { View } from "react-native";
import IButton from "@/components/buttons/IButton";
import { Ionicons } from "@expo/vector-icons";

interface DropSuperSetCellDoneProps {
    exerciseId: GymExercise["id"];
    supersetId: SuperSet["id"];
    setIndex: any;
    dropSetIndex: any;
    disabled: boolean;
};


const DropSuperSetCellDone: React.FC<DropSuperSetCellDoneProps> = ({ exerciseId, supersetId, setIndex, dropSetIndex, disabled }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { layoutId, exercise } = useGymActions(exerciseId);
    const { removeDropSet, getSuperSet } = useExerciseLayout();

    const ss = getSuperSet(layoutId, supersetId);
    if (!exercise || !ss)
        return null;
    const mode = ss.settings.supersetType;

    const handleRemove = () => {
        // if (mode === "circuit") {
        //     ss.layout.map((ex: any) => removeDropSet(layoutId, ex.id, setIndex, dropSetIndex));
        // } else
        removeDropSet(layoutId, exerciseId, setIndex, dropSetIndex);
    }
    return (
        <View
            key={`drop-set-cell-done-${setIndex}`}
            style={styles.cell}
        >
            <IButton
                width={"100%"} height={"100%"}
                onPress={handleRemove}
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

export default DropSuperSetCellDone;