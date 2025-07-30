import React, { useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import RestStopwatch from "../stopwatch/RestStopwatch";
import useGymActions from "../hooks/useGymActions";
import GymTableHeader from "./GymTableHeader";
import GymAddRowButton from "./GymAddRowButton";
import GymRow from "../row/GymRow";
import GymColumnLabels from "./GymColumnLabels";
import { GymExercise, SuperSet, useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import GymNotes from "../../text/GymNotes";
import { Sets } from "@/components/context/ExerciseZustand";
import SubTableHeader from "../superset_table/SubTableHeader";
import SuperSetRow from "../row/SuperSetRow";

interface GymTableProps {
    exerciseId: GymExercise["id"];
    supersetId?: SuperSet["id"];
}

export const GymTable: React.FC<GymTableProps> = ({ exerciseId, supersetId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { heightAnim, fadeIn, layoutId, exercise, setRestIndex } = useGymActions(exerciseId);
    const { restStatus, endRest, getSuperSet } = useExerciseLayout();

    const ss = getSuperSet(layoutId, supersetId ?? "");

    if (!exercise) {
        return null;
    }

    const opacity = heightAnim.interpolate({
        inputRange: [0, 34],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    return (
        <Animated.View
            key={`table-${exerciseId}-${restStatus}`}
            style={[{ flex: 1 }, fadeIn]}>
            <GestureHandlerRootView style={[styles.body]}>

                {ss ?
                    <SubTableHeader
                        exerciseId={exerciseId}
                        supersetId={supersetId ?? ""}
                    />
                    :
                    <GymTableHeader
                        exerciseId={exerciseId}
                    />
                }

                {restStatus.id === exerciseId ?
                    <RestStopwatch
                        exerciseId={exerciseId}
                        endRest={() => endRest(layoutId)}
                    />
                    :
                    null}

                {exercise?.sets?.length ? (
                    <>
                        <GymColumnLabels
                            exerciseId={exerciseId}
                            heightAnim={heightAnim}
                        />
                        <Animated.View
                            key={exerciseId}
                            style={[
                                styles.table,
                                {
                                    borderColor: color.handle,
                                    height: heightAnim,
                                    borderBottomLeftRadius: 16,
                                    borderBottomRightRadius: 16,
                                    opacity
                                },
                            ]}
                        >
                            {exercise?.sets?.map((set: Sets, index: any) => {
                                const commonProps = {
                                    key: exercise.sets?.length + index,
                                    exerciseId: exerciseId,
                                    index: index,
                                    set: set,
                                    startRest: () => { setRestIndex(index) },
                                };

                                if (ss)
                                    return <SuperSetRow supersetId={supersetId ?? ""} {...commonProps} />
                                return <GymRow {...commonProps} />
                            })}
                        </Animated.View>
                    </>
                ) : null}

                {ss?.settings.supersetType === "circuit" ?
                    null
                    :
                    <GymAddRowButton
                        exerciseId={exerciseId}
                        layoutId={layoutId}
                    />
                }


                {ss || exercise.settings.noNote ? null : <GymNotes
                    elementId={exerciseId} style={{ marginTop: 16 }} />}

            </GestureHandlerRootView >
        </Animated.View >
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
        borderWidth: 1,
        borderTopWidth: 0,
    },
});

export default GymTable;