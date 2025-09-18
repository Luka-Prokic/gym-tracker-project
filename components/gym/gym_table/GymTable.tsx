import React, { useState } from "react";
import { Animated, ScrollView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from "../../context/ThemeContext";
import Colors, { Themes } from "../../../constants/Colors";
import RestStopwatch from "../stopwatch/RestStopwatch";
import useGymActions from "../hooks/useGymActions";
import GymTableHeader from "./GymTableHeader";
import GymAddRowButton from "./GymAddRowButton";
import GymRow from "../row/GymRow";
import GymColumnLabels from "./GymColumnLabels";
import { useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import GymNotes from "../../text/GymNotes";
import { Sets } from "@/components/context/ExerciseZustand";
import SubTableHeader from "../superset_table/SubTableHeader";
import SuperSetRow from "../row/SuperSetRow";

interface GymTableProps {
    exerciseId: string;
    supersetId?: string;
    readOnly?: boolean;
}

export const GymTable: React.FC<GymTableProps> = ({ exerciseId, supersetId, readOnly }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { heightAnim, fadeIn, layoutId, exercise, setRestIndex } = useGymActions(exerciseId);
    const { restStatus, endRest, getSuperSet } = useExerciseLayout();

    // For read-only mode, calculate static height
    const totalSets = exercise?.sets?.length ?? 0;
    const totalDropSets = exercise?.sets?.reduce(
        (sum, set) => sum + (set.dropSets?.length ?? 0),
        0
    ) ?? 0;
    const staticHeight = totalSets * 44 + totalDropSets * 34 + 1;

    const ss = getSuperSet(layoutId, supersetId ?? "");

    if (!exercise) {
        console.log(`GymTable: No exercise found for ID ${exerciseId}`);
        return null;
    }

    console.log(`GymTable: Rendering exercise ${exerciseId}, readOnly: ${readOnly}, staticHeight: ${staticHeight}, totalSets: ${totalSets}`);

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
                        readOnly={readOnly}
                    />
                    :
                    <GymTableHeader
                        exerciseId={exerciseId}
                        readOnly={readOnly}
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
                            readOnly={readOnly}
                        />
                        <Animated.View
                            key={exerciseId}
                            style={[
                                styles.table,
                                {
                                    borderColor: color.handle,
                                    height: readOnly ? staticHeight : heightAnim,
                                    borderBottomLeftRadius: 16,
                                    borderBottomRightRadius: 16,
                                    opacity: readOnly ? 1 : opacity
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
                                    readOnly: readOnly,
                                };

                                if (ss)
                                    return <SuperSetRow supersetId={supersetId ?? ""} {...commonProps} />
                                return <GymRow {...commonProps} />
                            })}
                        </Animated.View>
                    </>
                ) : null}

                {!readOnly && ss?.settings.supersetType === "circuit" ?
                    null
                    :
                    !readOnly && <GymAddRowButton
                        exerciseId={exerciseId}
                        layoutId={layoutId}
                    />
                }


                {readOnly || ss || exercise.settings.noNote ? null : <GymNotes
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