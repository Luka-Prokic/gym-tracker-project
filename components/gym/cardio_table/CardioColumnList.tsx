import { StyleSheet, View } from "react-native";
import { SCREEN_WIDTH } from "../../../constants/ScreenWidth";
import React from "react";
import {
    CardioExercise,
    CardioValues,
    useExerciseLayout,
} from "@/components/context/ExerciseLayoutZustand";
import Colors, { Themes } from "@/constants/Colors";
import { useExercise } from "@/components/context/ExerciseZustand";
import { useTheme } from "@/components/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import useCardioActions, { allCardioToggles } from "../hooks/useCardioActions";
import CardioIcon from "./CardioIcon";
import hexToRGBA from "@/assets/hooks/HEXtoRGB";
import { ScrollView } from "react-native-gesture-handler";
import { Text } from "react-native";
import { ShakeButton } from "@/components/buttons/ShakeButton";
import capitalizeWords from "@/assets/hooks/capitalize";

interface CardioColumnSettingsProps {
    exerciseId: CardioExercise["id"];
}

export const excludedByEquipment: Record<string, (typeof allCardioToggles)[number]["key"][]> = {
    treadmill: ["noElevation"],
    bike: ["noElevation"],
    elliptical: ["noElevation", "noIncline", "noSteps"],
    rower: ["noElevation"],
    stairmaster: ["noDistance"],
    machine: ["noElevation", "noPace"],
    bodyweight: ["noSpeed", "noResistance"],
};

export const CardioColumnList: React.FC<CardioColumnSettingsProps> = ({
    exerciseId,
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { updateCardioExerciseSettings } = useExerciseLayout();
    const { getExercise } = useExercise();
    const { metrics, layoutId, exercise } = useCardioActions(exerciseId);
    if (!exercise) return null;

    const originalExercise = getExercise(exercise.exId);
    if (!originalExercise) return null;
    const { equipment } = originalExercise;



    const excludedKeys = excludedByEquipment[equipment] || [];
    const filteredToggles = allCardioToggles.filter((t) => !excludedKeys.includes(t.key));

    const orderedToggles = [
        ...metrics
            .map((label) => filteredToggles.find((t) => t.label === label))
            .filter((t): t is typeof filteredToggles[number] => Boolean(t)),
        ...filteredToggles.filter((t) => !metrics.includes(t.label)),
    ];

    const handleMoveUp = (index: number, settingKey: any, amount: number = 1) => {
        if (index >= metrics.length) {
            updateCardioExerciseSettings(
                layoutId,
                exerciseId,
                settingKey,
                false
            )
        }

        const target = index - amount;
        if (target < 0 || target >= metrics.length) {
            return

        };
        const newOrder = [...metrics];
        [newOrder[index], newOrder[target]] = [metrics[target], metrics[index]];
        updateCardioExerciseSettings(
            layoutId,
            exerciseId,
            "columnOrder",
            newOrder
        );
    };
    const handleMoveDown = (index: number, settingKey: any, amount: number = 1) => {
        if (index + 1 === metrics.length) {
            updateCardioExerciseSettings(
                layoutId,
                exerciseId,
                settingKey,
                true
            )
        }

        const target = index + amount;
        if (target < 0 || target >= metrics.length) {
            return

        };
        const newOrder = [...metrics];
        [newOrder[index], newOrder[target]] = [metrics[target], metrics[index]];
        updateCardioExerciseSettings(
            layoutId,
            exerciseId,
            "columnOrder",
            newOrder
        );
    };

    const handleLongPressUp = (
        index: number,
        settingKey: keyof CardioExercise["settings"]
    ) => {

        let newOrder: (keyof CardioValues)[];

        if (index >= metrics.length) {
            updateCardioExerciseSettings(layoutId, exerciseId, settingKey, false);

            const hiddenLabel = orderedToggles[index].label as keyof CardioValues;

            newOrder = [hiddenLabel, ...metrics];
        } else {
            newOrder = [...metrics];
            const [item] = newOrder.splice(index, 1);
            newOrder.unshift(item);
        }

        updateCardioExerciseSettings(
            layoutId,
            exerciseId,
            "columnOrder",
            newOrder as (keyof CardioValues)[]
        );
    };

    const handleLongPressDown = (settingKey: any) => {
        updateCardioExerciseSettings(
            layoutId,
            exerciseId,
            settingKey,
            true
        )
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
                paddingBottom: 144,
                paddingTop: 8,
                width: "100%",
            }}
            contentContainerStyle={{ paddingHorizontal: "5%", gap: 4 }}
        >
            {orderedToggles.map(({ key, label }, i) => {
                const settingKey = key as keyof CardioExercise["settings"];
                const ILabel = label === "heartRate" ? "heart rate" : label;
                const isShown = !exercise.settings[settingKey];
                const back = isShown ? .2 : .1;
                const iconColor = isShown ? color.text : color.grayText;

                return (
                    <View
                        key={`${key}-${label}`}
                        style={[
                            styles.card,
                            {
                                backgroundColor: hexToRGBA(color.text, back),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 2,
                                shadowColor: color.shadow,
                                borderColor: color.border,

                            },
                        ]}
                    >
                        <CardioIcon column={label} size={24} color={iconColor} />

                        <Text style={{ flex: 3, color: iconColor, fontSize: 18 }}>
                            {capitalizeWords(ILabel)}
                        </Text>

                        <View style={styles.arrows}>
                            <ShakeButton
                                size={44}
                                onPress={() => handleMoveDown(i, settingKey)}
                                onLongPress={() => handleLongPressDown(settingKey)}
                                icon={<Ionicons name="chevron-down" size={24} color={iconColor} />}
                                longPressIcon={<Ionicons name="chevron-down-circle" size={26} color={iconColor} />}
                                disabled={!isShown}
                            />
                            <ShakeButton
                                size={44}
                                onPress={() => handleMoveUp(i, settingKey)}
                                onLongPress={() => handleLongPressUp(i, settingKey)}
                                icon={<Ionicons name="chevron-up" size={24} color={color.text} />}
                                longPressIcon={<Ionicons name="chevron-up-circle" size={26} color={color.text} />}
                                disabled={i === 0}
                            />
                        </View>

                    </View>

                );
            })}
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    grid: {
        height: "100%",
        width: SCREEN_WIDTH,
        alignItems: "center",
    },
    card: {
        flexDirection: "row",
        height: 34,
        width: "100%",
        alignItems: "center",
        borderRadius: 16,
        paddingHorizontal: 8,
        gap: 8,
    },
    arrows: {
        width: 88,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginRight: 8,
    },
});