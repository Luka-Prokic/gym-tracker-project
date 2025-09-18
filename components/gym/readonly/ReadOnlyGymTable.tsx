import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import { Sets } from "../../context/ExerciseZustand";
import { useUser } from "../../context/UserZustend";
import useGetExerciseName from "../hooks/useGetExerciseName";
import { useDisplayedWeight, useDisplayedRest } from "../../context/user/hooks/filters";
import hexToRGBA from "../../../assets/hooks/HEXtoRGB";

interface ReadOnlyGymTableProps {
    exerciseId: string;
    layoutId: string;
}

export const ReadOnlyGymTable: React.FC<ReadOnlyGymTableProps> = ({ exerciseId, layoutId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { getGymExercise } = useExerciseLayout();
    const { settings } = useUser();
    const { fromKg } = useDisplayedWeight();
    const { fromSeconds } = useDisplayedRest();

    const exercise = getGymExercise(layoutId, exerciseId);
    const exId = exercise ? exercise.exId : "";
    const exerciseName = useGetExerciseName(exId);
    const weightUnit = settings.units.weight;

    if (!exercise || !exercise.sets?.length) {
        return null;
    }

    // Calculate table height
    const totalSets = exercise.sets.length;
    const totalDropSets = exercise.sets.reduce((sum, set) => sum + (set.dropSets?.length ?? 0), 0);
    const tableHeight = 34 + (totalSets * 44) + (totalDropSets * 34); // header + sets + dropsets
    
    console.log(`ReadOnlyGymTable: ${exerciseName}, sets: ${totalSets}, height: ${tableHeight}`);

    // Define columns based on exercise settings
    const columns = ["set", "reps", "kg", "rest"];
    if (!exercise.settings.noRIR) columns.push("rir");
    if (!exercise.settings.noRPE) columns.push("rpe");

    const formatRestTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${remainingSeconds}s`;
    };

    const getColumnValue = (set: Sets, column: string, setIndex: number, isDropSet: boolean = false) => {
        switch (column) {
            case "set":
                return `${setIndex + 1}`;
            case "reps":
                return set.reps?.toString() || "-";
            case "kg":
                return set.kg ? fromKg(set.kg) : "-";
            case "rest":
                return isDropSet ? "" : (set.rest ? formatRestTime(set.rest) : "-");
            case "rir":
                return set.rir?.toString() || "-";
            case "rpe":
                return set.rpe?.toString() || "-";
            default:
                return "-";
        }
    };

    return (
        <View style={[styles.container]}>
            {/* Exercise Name */}
            <Text style={[styles.exerciseName, { color: color.text }]}>
                {exerciseName || "Exercise"}
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
                {exercise.sets.map((set, setIndex) => (
                    <React.Fragment key={setIndex}>
                        {/* Main Set */}
                        <View 
                            style={[
                                styles.row, 
                                { 
                                    backgroundColor: setIndex % 2 === 0 ? color.primaryBackground : color.secondaryBackground,
                                    borderColor: color.handle 
                                }
                            ]}
                        >
                            {columns.map((column, colIndex) => (
                                <View key={colIndex} style={styles.cell}>
                                    <Text style={[styles.cellText, { color: color.text }]}>
                                        {getColumnValue(set, column, setIndex, false)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        
                        {/* Drop Sets */}
                        {set.dropSets?.map((dropSet, dropIndex) => (
                            <View 
                                key={`${setIndex}-${dropIndex}`}
                                style={[
                                    styles.dropRow, 
                                    { 
                                        backgroundColor: dropIndex % 2 === 1
                                            ? hexToRGBA(color.fourthBackground, 0.6)
                                            : color.fourthBackground,
                                        borderColor: color.handle 
                                    }
                                ]}
                            >
                                {columns.map((column, colIndex) => (
                                    <View key={colIndex} style={styles.cell}>
                                        <Text style={[styles.dropCellText, { color: color.secondaryText }]}>
                                            {getColumnValue(dropSet, column, setIndex, true)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </React.Fragment>
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
    dropRow: {
        flexDirection: "row",
        height: 34,
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
    dropCellText: {
        fontSize: 12,
        fontWeight: "400",
    },
});

export default ReadOnlyGymTable;
