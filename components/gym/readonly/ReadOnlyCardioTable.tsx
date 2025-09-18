import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import useGetExerciseName from "../hooks/useGetExerciseName";

interface ReadOnlyCardioTableProps {
    exerciseId: string;
    layoutId: string;
}

export const ReadOnlyCardioTable: React.FC<ReadOnlyCardioTableProps> = ({ exerciseId, layoutId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { getCardioExercise } = useExerciseLayout();

    const exercise = getCardioExercise(layoutId, exerciseId);
    const exId = exercise ? exercise.exId : "";
    const exerciseName = useGetExerciseName(exId);

    if (!exercise || !exercise.values?.length) {
        return null;
    }

    // Calculate table height
    const totalValues = exercise.values.length;
    const tableHeight = 34 + (totalValues * 44); // header + values

    const columns = ["set", "duration", "distance", "calories"];
    if (exercise.settings.showHeartRate) columns.push("hr");

    const getColumnValue = (value: any, column: string, valueIndex: number) => {
        switch (column) {
            case "set":
                return `${valueIndex + 1}`;
            case "duration":
                return value.duration ? `${value.duration}s` : "-";
            case "distance":
                return value.distance ? `${value.distance}m` : "-";
            case "calories":
                return value.calories ? `${value.calories}` : "-";
            case "hr":
                return value.heartRate ? `${value.heartRate}` : "-";
            default:
                return "-";
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: color.background }]}>
            {/* Exercise Name */}
            <Text style={[styles.exerciseName, { color: color.text }]}>
                {exerciseName || "Cardio Exercise"}
            </Text>

            {/* Table */}
            <View style={[styles.table, { borderColor: color.handle, height: tableHeight }]}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: color.background, borderColor: color.handle }]}>
                    {columns.map((column, index) => (
                        <View key={index} style={styles.headerCell}>
                            <Text style={[styles.headerText, { color: color.grayText }]}>
                                {column.toUpperCase()}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Rows */}
                {exercise.values.map((value, valueIndex) => (
                    <View 
                        key={valueIndex} 
                        style={[
                            styles.row, 
                            { 
                                backgroundColor: valueIndex % 2 === 0 ? color.primaryBackground : color.secondaryBackground,
                                borderColor: color.handle 
                            }
                        ]}
                    >
                        {columns.map((column, colIndex) => (
                            <View key={colIndex} style={styles.cell}>
                                <Text style={[styles.cellText, { color: color.text }]}>
                                    {getColumnValue(value, column, valueIndex)}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 16,
    },
    exerciseName: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    table: {
        borderRadius: 12,
        borderWidth: 1,
        overflow: "hidden",
    },
    header: {
        flexDirection: "row",
        borderBottomWidth: 1,
        height: 34,
    },
    headerCell: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    headerText: {
        fontSize: 12,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    row: {
        flexDirection: "row",
        height: 44,
        borderBottomWidth: 0.5,
    },
    cell: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    cellText: {
        fontSize: 14,
        fontWeight: "500",
    },
});

export default ReadOnlyCardioTable;