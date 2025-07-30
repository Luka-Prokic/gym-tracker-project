import { useEffect, useRef, useState } from "react";
import { CardioExercise, CardioSettings, CardioValues, useExerciseLayout } from "../../context/ExerciseLayoutZustand";
import { useRoutine } from "../../context/RoutineZustand";
import useGetExerciseName from "./useGetExerciseName";
import { Animated } from "react-native";
import useFadeInAnim from "@/assets/animations/useFadeInAnim";


export const allCardioToggles = [
    { key: "noDuration", label: "duration" },
    { key: "noDistance", label: "distance" },
    { key: "noIntensity", label: "intensity" },
    { key: "noPace", label: "pace" },
    { key: "noSpeed", label: "speed" },
    { key: "noCalories", label: "calories" },
    { key: 'noHeartRate', label: 'heartRate' },
    { key: "noSteps", label: "steps" },
    { key: "noCadence", label: "cadence" },
    { key: "noElevation", label: "elevation" },
    { key: "noIncline", label: "incline" },
    { key: "noResistance", label: "resistance" },
    { key: "noLabel", label: "label" },
] as const;

export interface CardioActionsReturn {
    exercise: CardioExercise | undefined;
    exId: string;
    layoutId: string;
    settingsVisible: boolean;
    cardioName: string;
    openSettings: () => void;
    closeSettings: () => void;
    metrics: (keyof CardioValues)[];
    fadeIn: any;
    heightAnim: any;
}

const useCardioActions = (id: CardioExercise["id"]): CardioActionsReturn => {
    const { getCardioExercise, restStatus } = useExerciseLayout();
    const { activeRoutine } = useRoutine();
    const { fadeIn } = useFadeInAnim();

    const [settingsVisible, setSettingsVisible] = useState(false);
    const openSettings = () => setSettingsVisible(true);
    const closeSettings = () => setSettingsVisible(false);

    const layoutId = activeRoutine.layoutId;
    const exercise = getCardioExercise(layoutId, id);
    const exId = exercise?.exId ?? "";
    const cardioName = useGetExerciseName(exId);

    const [metrics, setMetrics] = useState<(keyof CardioValues)[]>(exercise?.settings.columnOrder ?? []);
    useEffect(() => {
        if (!exercise) {
            setMetrics([]);
            return;
        }

        const s = exercise.settings ?? {};
        const currentOrder = (s.columnOrder ?? []) as (keyof CardioValues)[];

        const enabledColumns = allCardioToggles
            .filter(({ key }) => !s[key as keyof CardioSettings])
            .map(({ label }) => label) as (keyof CardioValues)[];

        const newOrder: (keyof CardioValues)[] = [
            ...currentOrder.filter((key) => enabledColumns.includes(key)),
            ...enabledColumns.filter((key) => !currentOrder.includes(key))
        ];

        setMetrics(newOrder);
    }, [exercise?.settings]);


    const heightAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const newHeight = exercise?.intervals?.length ? restStatus.id === id ? 0 : metrics.length * 44 + 69 : 34;
        Animated.timing(heightAnim, {
            toValue: newHeight,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [metrics.length, exercise?.intervals?.length, restStatus.id]);

    return {
        exercise,
        exId,
        layoutId,
        settingsVisible,
        cardioName,
        openSettings,
        closeSettings,
        metrics,
        fadeIn,
        heightAnim,
    };
};

export default useCardioActions;