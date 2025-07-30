import React from "react";
import { Pressable, Swipeable } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import {
    CardioExercise,
    CardioValues
} from "../../context/ExerciseLayoutZustand";
import useCardioActions from "../hooks/useCardioActions";
import CardioRowOptions from "./CardioRowOptions";
import { formatCardioKey } from "@/assets/hooks/formatCardioValueKey";
import CardioIcon from "../cardio_table/CardioIcon";
import CardioCell from "../input/CardioCell";

interface CardioRowProps {
    exerciseId: CardioExercise["id"];
    intervalIndex: number;
    index: number;
    column: keyof CardioValues;
}

export const CardioRow: React.FC<CardioRowProps> = ({
    exerciseId,
    intervalIndex,
    index,
    column
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const {
        exercise,
        layoutId,
        settingsVisible,
        openSettings,
        closeSettings
    } = useCardioActions(exerciseId);

    if (!exercise?.intervals?.[intervalIndex]) return null;
    const interval = exercise.intervals[intervalIndex];

    const checked = !!interval.rest;
    const backgroundColor = checked ? color.accent : index % 2 ? color.secondaryBackground : color.primaryBackground;
    const labelColor = checked ? color.secondaryText : color.text;

    const renderRightActions = () => (
        <CardioRowOptions exerciseId={exerciseId} column={column} />
    );

    return (
        <Swipeable
            key={`swipe-${index}-${checked}`}
            renderRightActions={renderRightActions}
            onSwipeableOpenStartDrag={openSettings}
            onSwipeableClose={closeSettings}
        >
            <Pressable
                style={[
                    styles.row,
                    { backgroundColor }
                ]}
                disabled={settingsVisible}
                pointerEvents={settingsVisible ? 'none' : 'auto'}
            >
                {column === "label" ?
                    <View style={{ marginHorizontal: 8, justifyContent: "center", alignItems: "center" }}>
                        <CardioIcon
                            column={column}
                            color={labelColor}
                        />
                    </View>
                    :
                    <View style={styles.column}>
                        <CardioIcon
                            column={column}
                            color={labelColor}
                        />



                        <Text
                            style={[
                                styles.label,
                                { color: labelColor }
                            ]}
                        >
                            {formatCardioKey(column)}
                        </Text>

                    </View>
                }

                <CardioCell
                    exerciseId={exerciseId}
                    intervalIndex={intervalIndex}
                    column={column}
                    disabled={settingsVisible}
                />

            </Pressable>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        height: 44,
    },
    label: {
        fontWeight: "bold",
        textTransform: "uppercase",
        fontSize: 16,
    },
    column: {
        flexDirection: "row",
        height: 44,
        width: "55%",
        gap: 8,
        alignItems: "center",
        paddingLeft: 8
    },
});

export default CardioRow;