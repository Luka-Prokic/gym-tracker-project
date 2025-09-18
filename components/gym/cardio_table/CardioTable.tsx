import React, { useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import RestStopwatch from "../stopwatch/RestStopwatch";
import useCardioActions from "../hooks/useCardioActions";
import CardioTableHeader from "./CardioTableHeader";
import { CardioExercise, CardioValues, SuperSet, useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import CardioRow from "../row/CardioRow";
import SubTableHeader from "../superset_table/SubTableHeader";
import GymNotes from "../../text/GymNotes";
import IntervalBar from "./IntervalBar";
import IntervalRow from "./IntervalRow";
import SubRow from "./SubRow";

interface CardioTableProps {
    exerciseId: CardioExercise["id"];
    supersetId?: SuperSet["id"];
    readOnly?: boolean;
}

export const CardioTable: React.FC<CardioTableProps> = ({ exerciseId, supersetId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { exercise, layoutId, metrics, fadeIn, heightAnim } = useCardioActions(exerciseId);
    const { restStatus, endRest, getSuperSet, getIntervals } = useExerciseLayout();
    const intervals = getIntervals(layoutId, exerciseId);

    if (!exercise) return null;

    const [intervalIndex, setIntervalIndex] = useState<number>(intervals?.length ? intervals?.length - 1 : 0);

    const ss = getSuperSet(layoutId, supersetId ?? "");

    const opacity = heightAnim.interpolate({
        inputRange: [0, 34],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    return (
        <Animated.View style={[{ flex: 1 }, fadeIn]}>
            <GestureHandlerRootView style={styles.body}>

                {ss ?
                    <SubTableHeader
                        exerciseId={exerciseId}
                        supersetId={supersetId ?? ""}
                    />
                    :
                    <CardioTableHeader
                        exerciseId={exerciseId}
                    />
                }


                {restStatus.id === exerciseId && (
                    <RestStopwatch
                        exerciseId={exerciseId}
                        endRest={() => endRest(layoutId)}
                    />
                )}

                <Animated.View
                    style={[
                        styles.table,
                        {
                            borderColor: color.handle,
                            height: heightAnim,
                            borderRadius: 16,
                            opacity
                        },
                        ss?.settings.supersetType === "circuit" && exercise.intervals && !exercise.intervals.length ? { borderWidth: 0, height: 0 } : { borderWidth: 1 }
                    ]}
                >
                    {ss?.settings.supersetType === "circuit" ?
                        <SubRow supersetId={ss.id} exerciseId={exerciseId} intervalIndex={intervalIndex}
                            setIndex={setIntervalIndex} />
                        :
                        <IntervalRow exerciseId={exerciseId} intervalIndex={intervalIndex}
                            setIndex={setIntervalIndex} />}

                    {metrics.map((met: keyof CardioValues, index: number) => {

                        return (
                            <CardioRow
                                key={`c-row-${index}-${met}-${intervalIndex}-${intervals?.map(i => i[met]).join("-")}`}
                                exerciseId={exerciseId} intervalIndex={intervalIndex} index={index} column={met}
                            />
                        )
                    })}


                    {ss?.settings.supersetType === "circuit" && exercise.intervals && !exercise.intervals.length ? null : <IntervalBar
                        selectedIndex={intervalIndex}
                        setIndex={setIntervalIndex}
                        total={exercise.intervals?.length ?? 0}
                        exerciseId={exerciseId}
                    />}

                </Animated.View>

                {ss || exercise.settings.noNote ? null : <GymNotes
                    elementId={exerciseId} style={{ marginTop: 16 }} />}

            </GestureHandlerRootView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    body: {
        width: "90%",
        marginHorizontal: "5%",
    },
    table: {
        width: "100%",
        overflow: "hidden",
    },
    selector: {
        height: 44,
        width: "100%",
        flexDirection: "row"
    },
});

export default CardioTable;