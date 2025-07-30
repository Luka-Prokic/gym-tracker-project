import { StyleSheet } from "react-native";
import {
    DndProvider,
    Draggable,
    DraggableGrid,
    UniqueIdentifier,
} from "@mgcrea/react-native-dnd";
import { SCREEN_WIDTH } from "../../../constants/ScreenWidth";
import React, { useState } from "react";
import OptionButton from "@/components/buttons/OptionButton";
import { useRoutine } from "@/components/context/RoutineZustand";
import {
    CardioExercise,
    useExerciseLayout,
} from "@/components/context/ExerciseLayoutZustand";
import Colors, { Themes } from "@/constants/Colors";
import { useExercise } from "@/components/context/ExerciseZustand";
import { useTheme } from "@/components/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useDragLock } from "@/components/bubbles/ISlide";
import useCardioActions, { allCardioToggles } from "../hooks/useCardioActions";
import CardioIcon from "./CardioIcon";
import hexToRGBA from "@/assets/hooks/HEXtoRGB";

interface CardioColumnListProps {
    exerciseId: CardioExercise["id"];
}

export const CardioColumnDnD: React.FC<CardioColumnListProps> = ({
    exerciseId,
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { getCardioExercise, updateCardioExerciseSettings } =
        useExerciseLayout();
    const { activeRoutine } = useRoutine();
    const { getExercise } = useExercise();
    const layoutId = activeRoutine.layoutId;
    const { metrics } = useCardioActions(exerciseId);
    const exercise = getCardioExercise(layoutId, exerciseId);
    if (!exercise) return null;

    const originalExercise = getExercise(exercise.exId);
    if (!originalExercise) return null;
    const { equipment } = originalExercise;

    const excludedByEquipment: Record<
        string,
        (typeof allCardioToggles[number]["key"])[]
    > = {
        treadmill: ["noElevation"],
        bike: ["noElevation"],
        elliptical: ["noElevation", "noIncline", "noSteps"],
        rower: ["noElevation", "noPace"],
        stairmaster: ["noDistance"],
        machine: ["noElevation", "noPace"],
        bodyweight: ["noSpeed", "noResistance"],
    };

    const excludedKeys = excludedByEquipment[equipment] || [];
    const filteredToggles = allCardioToggles.filter(
        (t) => !excludedKeys.includes(t.key)
    );

    const orderedToggles = [
        ...metrics
            .map(label => filteredToggles.find(t => t.label === label))
            .filter((t): t is (typeof allCardioToggles)[number] => Boolean(t)),
        ...filteredToggles.filter(t => !metrics.includes(t.label)),
    ];


    const [key, setKey] = useState(0);

    const handleOrderChange = (newOrder: UniqueIdentifier[]) => {
        const reorderedItems = newOrder.map(id => {
            const [key, label] = String(id).split("-");
            return { key, label } as (typeof allCardioToggles)[number];
        });

        const isSame =
            reorderedItems.length === filteredToggles.length &&
            reorderedItems.every((item, idx) =>
                item.key === filteredToggles[idx].key &&
                item.label === filteredToggles[idx].label
            );
        if (isSame) return;

        setKey(prev => prev + 1);

        updateCardioExerciseSettings(
            layoutId,
            exerciseId,
            "columnOrder",
            reorderedItems.map(item => item.label)
        );
    };



    const { setInnerDragging } = useDragLock();

    return (
        <DndProvider
            onActivation={() => setInnerDragging(true)}
            onDragEnd={() => setInnerDragging(false)}
        >
            <DraggableGrid
                key={key}
                direction="column"
                size={1}
                style={styles.grid}
                onOrderChange={handleOrderChange}
            >
                {orderedToggles.map(({ key, label }) => {
                    const ILabel = label === "heartRate" ? "hear rate" : label;
                    const settingKey = key as keyof CardioExercise["settings"];
                    const isShown = !exercise.settings[settingKey];
                    const title = isShown ? `Hide ${ILabel}` : `Show ${ILabel}`;
                    const iconName = isShown ? "checkmark-circle" : "close-circle";
                    const iconColor = isShown ? color.text : color.grayText;

                    return (
                        <Draggable
                            key={`${key}-${label}`}
                            id={`${key}-${label}`}
                            style={[styles.draggable, { backgroundColor: hexToRGBA(color.grayText, .2) }]}
                        >
                            <CardioIcon column={label} size={24} color={iconColor} />
                            <OptionButton
                                title={title}
                                style={{ flex: 1 }}
                                color={iconColor}
                                icon={<Ionicons name={iconName} color={iconColor} size={24} />}
                                onPress={() => {
                                    updateCardioExerciseSettings(
                                        layoutId,
                                        exerciseId,
                                        settingKey,
                                        isShown
                                    );
                                }}
                            />
                        </Draggable>
                    );
                })}
            </DraggableGrid>
        </DndProvider>
    );
};

const styles = StyleSheet.create({
    grid: {
        height: "100%",
        width: SCREEN_WIDTH,
        alignItems: "center",
    },
    draggable: {
        flexDirection: "row",
        height: 34,
        width: "90%",
        alignItems: "center",
        borderRadius: 17,
        paddingLeft: 8,
    },
});