import { Animated, Text, View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { GymExercise } from "../context/ExerciseLayoutZustand";
import useLayoutGymActions from "./hooks/useLayoutGymActions";

interface LayoutGymColumnLabelsProps {
    exerciseId: GymExercise["id"];
    heightAnim: Animated.Value;
}

const LayoutGymColumnLabels: React.FC<LayoutGymColumnLabelsProps> = ({ exerciseId, heightAnim }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { columns } = useLayoutGymActions(exerciseId);

    const getColumnLabel = (column: string) => {
        switch (column) {
            case "set": return "Set";
            case "kg": return "Weight";
            case "reps": return "Reps";
            case "rir": return "RIR";
            case "rpe": return "RPE";
            case "rest": return "Rest";
            case "note": return "Note";
            default: return column;
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    height: heightAnim,
                    backgroundColor: color.primaryBackground,
                    borderColor: color.handle,
                }
            ]}
        >
            {columns.map((column) => (
                <View key={column} style={styles.labelContainer}>
                    <Text style={[styles.label, { color: color.text }]}>
                        {getColumnLabel(column)}
                    </Text>
                </View>
            ))}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderWidth: 1,
        borderBottomWidth: 0,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    labelContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 44,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },
});

export default LayoutGymColumnLabels;
