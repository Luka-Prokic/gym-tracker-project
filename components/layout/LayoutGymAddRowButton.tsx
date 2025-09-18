import { Text, View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { GymExercise } from "../context/ExerciseLayoutZustand";
import IButton from "../buttons/IButton";
import { Ionicons } from "@expo/vector-icons";
import useLayoutGymActions from "./hooks/useLayoutGymActions";

interface LayoutGymAddRowButtonProps {
    exerciseId: GymExercise["id"];
    layoutId: string;
}

const LayoutGymAddRowButton: React.FC<LayoutGymAddRowButtonProps> = ({ exerciseId, layoutId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { addSet } = useLayoutGymActions(exerciseId);

    return (
        <View style={styles.container}>
            <IButton
                height={44}
                width={"100%"}
                onPress={() => addSet(layoutId, exerciseId)}
                color={color.primaryBackground}
                textColor={color.accent}
            >
                <View style={styles.buttonContent}>
                    <Ionicons name="add" size={20} color={color.accent} />
                    <Text style={[styles.text, { color: color.accent }]}>Add Set</Text>
                </View>
            </IButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginTop: 8,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
    },
});

export default LayoutGymAddRowButton;
