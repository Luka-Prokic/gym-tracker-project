import { Text, View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import { GymExercise, SuperSet } from "../context/ExerciseLayoutZustand";
import useLayoutGymActions from "./hooks/useLayoutGymActions";

interface LayoutSubTableHeaderProps {
    exerciseId: GymExercise["id"];
    supersetId: SuperSet["id"];
}

const LayoutSubTableHeader: React.FC<LayoutSubTableHeaderProps> = ({ exerciseId, supersetId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { exercise, exerciseName } = useLayoutGymActions(exerciseId);

    if (!exercise) return null;

    return (
        <View style={[styles.container, { backgroundColor: color.secondaryBackground }]}>
            <Text style={[styles.title, { color: color.text }]}>
                {exerciseName}
            </Text>
            <Text style={[styles.subtitle, { color: color.secondaryText }]}>
                Super Set Exercise
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderWidth: 1,
        borderBottomWidth: 0,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
});

export default LayoutSubTableHeader;
