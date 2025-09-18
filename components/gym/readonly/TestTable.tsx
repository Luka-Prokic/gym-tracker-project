import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import useGetExerciseName from "../hooks/useGetExerciseName";

interface TestTableProps {
    exerciseId: string;
    layoutId: string;
}

export const TestTable: React.FC<TestTableProps> = ({ exerciseId, layoutId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { getGymExercise } = useExerciseLayout();

    const exercise = getGymExercise(layoutId, exerciseId);
    const exId = exercise ? exercise.exId : "";
    const exerciseName = useGetExerciseName(exId);

    console.log(`TestTable: ${exerciseId}, exercise: ${!!exercise}, name: ${exerciseName}`);

    return (
        <View style={[styles.container, { backgroundColor: color.accent }]}>
            <Text style={[styles.text, { color: color.text }]}>
                TEST: {exerciseName || "Unknown Exercise"}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "90%",
        marginHorizontal: "5%",
        marginBottom: 16,
        padding: 20,
        borderRadius: 8,
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default TestTable;
