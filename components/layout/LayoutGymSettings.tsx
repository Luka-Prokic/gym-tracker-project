import { Text, View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { GymExercise } from "../context/ExerciseLayoutZustand";
import IButton from "../buttons/IButton";
import { Ionicons } from "@expo/vector-icons";
import useLayoutGymActions from "./hooks/useLayoutGymActions";

interface LayoutGymSettingsProps {
    exerciseId: GymExercise["id"];
    onClose: () => void;
}

const LayoutGymSettings: React.FC<LayoutGymSettingsProps> = ({ exerciseId, onClose }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { exercise, toggleColumn } = useLayoutGymActions(exerciseId);

    if (!exercise) return null;

    const columns = [
        { key: "kg", label: "Weight" },
        { key: "reps", label: "Reps" },
        { key: "rir", label: "RIR" },
        { key: "rpe", label: "RPE" },
        { key: "rest", label: "Rest" },
        { key: "note", label: "Note" },
    ];

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: color.text }]}>Column Settings</Text>
            
            <View style={styles.columnsContainer}>
                {columns.map((column) => (
                    <IButton
                        key={column.key}
                        height={40}
                        width={"100%"}
                        onPress={() => toggleColumn(exerciseId, column.key as any)}
                        color={exercise.settings[`no${column.key.charAt(0).toUpperCase() + column.key.slice(1)}` as keyof typeof exercise.settings] 
                            ? color.secondaryBackground 
                            : color.accent}
                        textColor={exercise.settings[`no${column.key.charAt(0).toUpperCase() + column.key.slice(1)}` as keyof typeof exercise.settings] 
                            ? color.text 
                            : color.primaryBackground}
                    >
                        <Text style={styles.columnText}>
                            {exercise.settings[`no${column.key.charAt(0).toUpperCase() + column.key.slice(1)}` as keyof typeof exercise.settings] 
                                ? `Hide ${column.label}` 
                                : `Show ${column.label}`}
                        </Text>
                    </IButton>
                ))}
            </View>

            <IButton
                height={40}
                width={"100%"}
                onPress={onClose}
                color={color.primaryBackground}
                textColor={color.text}
            >
                <Text style={styles.closeText}>Done</Text>
            </IButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 16,
        gap: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    columnsContainer: {
        gap: 8,
    },
    columnText: {
        fontSize: 16,
        fontWeight: "500",
    },
    closeText: {
        fontSize: 16,
        fontWeight: "600",
    },
});

export default LayoutGymSettings;
