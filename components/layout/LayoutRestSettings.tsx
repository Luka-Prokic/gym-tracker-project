import { Text, View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { GymExercise } from "../context/ExerciseLayoutZustand";
import IButton from "../buttons/IButton";
import { Ionicons } from "@expo/vector-icons";
import useLayoutGymActions from "./hooks/useLayoutGymActions";

interface LayoutRestSettingsProps {
    exerciseId: GymExercise["id"];
}

const LayoutRestSettings: React.FC<LayoutRestSettingsProps> = ({ exerciseId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { exercise, updateRestLength } = useLayoutGymActions(exerciseId);

    if (!exercise) return null;

    const restOptions = [30, 60, 90, 120, 180, 300]; // seconds

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: color.text }]}>Rest:</Text>
            
            <View style={styles.optionsContainer}>
                {restOptions.map((seconds) => (
                    <IButton
                        key={seconds}
                        height={32}
                        width={50}
                        onPress={() => updateRestLength(exerciseId, seconds)}
                        color={exercise.restLength === seconds ? color.accent : color.primaryBackground}
                        textColor={exercise.restLength === seconds ? color.primaryBackground : color.text}
                    >
                        <Text style={styles.optionText}>
                            {seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m`}
                        </Text>
                    </IButton>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
    },
    optionsContainer: {
        flexDirection: "row",
        gap: 4,
    },
    optionText: {
        fontSize: 14,
        fontWeight: "500",
    },
});

export default LayoutRestSettings;
