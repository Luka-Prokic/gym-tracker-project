import { StyleSheet, View } from "react-native";
import { SCREEN_WIDTH } from "../../../constants/ScreenWidth";
import React, { useState } from "react";
import {
    CardioExercise,
    useExerciseLayout,
} from "@/components/context/ExerciseLayoutZustand";
import Colors, { Themes } from "@/constants/Colors";
import { useTheme } from "@/components/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import useCardioActions, { allCardioToggles } from "../hooks/useCardioActions";
import hexToRGBA from "@/assets/hooks/HEXtoRGB";
import { ScrollView } from "react-native-gesture-handler";
import { Text } from "react-native";
import { ShakeButton } from "@/components/buttons/ShakeButton";
import IText from "@/components/text/IText";

interface IntervalSwapListProps {
    exerciseId: CardioExercise["id"];
}

export const IntervalSwapList: React.FC<IntervalSwapListProps> = ({
    exerciseId,
}) => {
    const { theme } = useTheme();
    const color = Colors[theme as Themes];
    const { updateInterval } = useExerciseLayout();
    const { exercise, layoutId } = useCardioActions(exerciseId);
    const [iKey, setKey] = useState(0);
    if (!exercise || !exercise.intervals) return null;


    const handleMoveUp = (index: number) => {
        if (!exercise?.intervals || index <= 0) return;

        setKey((prev) => prev + 1);
        const newIntervals = [...exercise.intervals];
        const temp = newIntervals[index];
        newIntervals[index] = newIntervals[index - 1];
        newIntervals[index - 1] = temp;

        newIntervals.forEach((interval, i) => {
            updateInterval(layoutId, exerciseId, i, interval);
        });
    };

    const handleMoveDown = (index: number) => {
        if (!exercise?.intervals || index >= exercise.intervals.length - 1) return;

        setKey((prev) => prev + 1);
        const newIntervals = [...exercise.intervals];
        const temp = newIntervals[index];
        newIntervals[index] = newIntervals[index + 1];
        newIntervals[index + 1] = temp;

        newIntervals.forEach((interval, i) => {
            updateInterval(layoutId, exerciseId, i, interval);
        });
    };

    const handleLongPressUp = (index: number) => {
        if (!exercise?.intervals || index <= 0) return;

        setKey((prev) => prev + 1);
        const newIntervals = [...exercise.intervals];
        const [moved] = newIntervals.splice(index, 1);
        newIntervals.unshift(moved);

        newIntervals.forEach((interval, i) => {
            updateInterval(layoutId, exerciseId, i, interval);
        });
    };

    const handleLongPressDown = (index: number) => {
        if (!exercise?.intervals || index >= exercise.intervals.length - 1) return;

        setKey((prev) => prev + 1);
        const newIntervals = [...exercise.intervals];
        const [moved] = newIntervals.splice(index, 1);
        newIntervals.push(moved);

        newIntervals.forEach((interval, i) => {
            updateInterval(layoutId, exerciseId, i, interval);
        });
    };


    return (
        <ScrollView
            key={iKey}
            showsVerticalScrollIndicator={false}
            style={{
                paddingBottom: 144,
                paddingTop: 8,
                width: "100%",
            }}
            contentContainerStyle={{ paddingHorizontal: "5%", gap: 8 }}
        >
            {exercise.intervals.map((interval, index) => {

                const text = interval.rest ? color.secondaryText : color.text;
                const background = interval.rest ? color.accent : hexToRGBA(color.secondaryBackground, .4);
                return (
                    <View
                        key={`${index}`}
                        style={[
                            styles.card,
                            {
                                backgroundColor: background,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 2,
                                shadowColor: color.shadow,
                                borderColor: color.border,
                            },
                        ]}
                    >
                        <Text style={{ fontWeight: "bold", color: text, fontSize: 16 }}>
                            {index + 1 + "."}
                        </Text>
                        <IText
                            style={{ color: text, fontSize: 16 }}
                            value={interval.label}
                            onChange={() => { }}
                        />

                        <View style={styles.arrows}>
                            <ShakeButton
                                size={44}
                                onPress={() => handleMoveDown(index)}
                                onLongPress={() => handleLongPressDown(index)}
                                icon={<Ionicons name="chevron-down" size={24} color={text} />}
                                longPressIcon={<Ionicons name="chevron-down-circle" size={26} color={text} />}
                                disabled={index + 1 === exercise.intervals?.length}
                            />
                            <ShakeButton
                                size={44}
                                onPress={() => handleMoveUp(index)}
                                onLongPress={() => handleLongPressUp(index)}
                                icon={<Ionicons name="chevron-up" size={24} color={text} />}
                                longPressIcon={<Ionicons name="chevron-up-circle" size={26} color={text} />}
                                disabled={index === 0}
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
    arrows: {
        position: "absolute",
        right: 8,
        width: 88,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginRight: 8,
    },
    card: {
        width: "100%",
        height: 54,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
    },
});