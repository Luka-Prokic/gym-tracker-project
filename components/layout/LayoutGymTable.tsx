import React, { useState } from "react";
import { Animated, ScrollView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from "../context/ThemeContext";
import Colors, { Themes } from "../../constants/Colors";
import useLayoutGymActions from "./hooks/useLayoutGymActions";
import LayoutGymTableHeader from "./LayoutGymTableHeader";
import LayoutGymAddRowButton from "./LayoutGymAddRowButton";
import LayoutGymRow from "./LayoutGymRow";
import LayoutGymColumnLabels from "./LayoutGymColumnLabels";
import { GymExercise, SuperSet, useExerciseLayout } from "../context/ExerciseLayoutZustand";
import LayoutGymNotes from "./LayoutGymNotes";
import { Sets } from "../context/ExerciseZustand";
import LayoutSubTableHeader from "./LayoutSubTableHeader";
import LayoutSuperSetRow from "./LayoutSuperSetRow";

interface LayoutGymTableProps {
    exerciseId: string;
    supersetId?: string;
}

export const LayoutGymTable: React.FC<LayoutGymTableProps> = ({ exerciseId, supersetId }) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { heightAnim, fadeIn, layoutId, exercise, setRestIndex } = useLayoutGymActions(exerciseId);
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
                    <LayoutSubTableHeader
                        exerciseId={exerciseId}
                        supersetId={supersetId ?? ""}
                    />
                    :
                    <LayoutGymTableHeader
                        exerciseId={exerciseId}
                    />
                }

                {exercise?.sets?.length ? (
                    <>
                        <LayoutGymColumnLabels
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
                                    return <LayoutSuperSetRow supersetId={supersetId ?? ""} {...commonProps} />
                                return <LayoutGymRow {...commonProps} />
                            })}
                        </Animated.View>
                    </>
                ) : null}

                {ss?.settings.supersetType === "circuit" ?
                    null
                    :
                    <LayoutGymAddRowButton
                        exerciseId={exerciseId}
                        layoutId={layoutId}
                    />
                }

                {ss || exercise.settings.noNote ? null : <LayoutGymNotes
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

export default LayoutGymTable;