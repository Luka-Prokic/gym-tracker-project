import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import { useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import { ReadOnlyGymTable } from "./ReadOnlyGymTable";
import { ReadOnlyCardioTable } from "./ReadOnlyCardioTable";
import { isGymExercise, isCardioExercise } from "../../context/utils/GymUtils";
import hexToRGBA from "@/assets/hooks/HEXtoRGB";

interface ReadOnlySuperSetTableProps {
    supersetId: string;
    layoutId: string;
}

export const ReadOnlySuperSetTable: React.FC<ReadOnlySuperSetTableProps> = ({ supersetId, layoutId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { getSuperSet } = useExerciseLayout();

    const ss = getSuperSet(layoutId, supersetId);

    if (!ss || !ss.layout.length) {
        return null;
    }

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: hexToRGBA(color.fourthBackground, 0.2),
                shadowColor: color.shadow,
                borderColor: color.border,
            }
        ]}>
            {/* SuperSet Header */}
            <View style={[styles.header]}>
                <Text style={[styles.headerText, { color: color.text }]}>
                    {ss.name || "SuperSet"}
                </Text>
            </View>

            {/* Exercises */}
            {ss.layout.map((ex: any, index: number) => {
                if (isGymExercise(ex)) {
                    return <ReadOnlyGymTable key={`subtable-${index}`} exerciseId={ex.id} layoutId={layoutId} />;
                } else if (isCardioExercise(ex)) {
                    return <ReadOnlyCardioTable key={`subtable-${index}`} exerciseId={ex.id} layoutId={layoutId} />;
                }
                return null;
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 16,
        borderRadius: 16,
        borderWidth: 1,
        overflow: "hidden",
        alignItems: "center",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        gap: 16,
    },
    header: {
        padding: 12,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default ReadOnlySuperSetTable;