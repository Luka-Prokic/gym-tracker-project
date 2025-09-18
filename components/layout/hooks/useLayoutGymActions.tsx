import { useEffect, useRef, useState } from "react";
import { Exercise, Sets } from "../../context/ExerciseZustand";
import { Layout, useExerciseLayout, GymExercise, LayoutItem } from "../../context/ExerciseLayoutZustand";
import { useRoutine } from "../../context/RoutineZustand";
import useGetExerciseName from "../../gym/hooks/useGetExerciseName";
import { Animated } from "react-native";
import useFadeInAnim from "@/assets/animations/useFadeInAnim";

interface LayoutGymActionsReturn {
    exercise: GymExercise | undefined;
    exId: Exercise["id"];
    layoutId: Layout["id"];
    settingsVisible: boolean;
    exerciseName: string;
    closeSettings: () => void;
    openSettings: () => void;
    columns: (keyof Sets | "set")[]; // Excludes "done" for layout editing
    heightAnim: Animated.Value;
    restIndex: number;
    fadeIn: any;
    setRestIndex: React.Dispatch<React.SetStateAction<number>>;
    // Additional functions needed by layout components
    addSet: (layoutId: Layout["id"], exId: GymExercise["id"], newSet?: Sets) => void;
    removeSet: (layoutId: Layout["id"], exId: GymExercise["id"], setIndex: number) => void;
    addDropSet: (layoutId: Layout["id"], exId: GymExercise["id"], setIndex: number, newDropSet?: any) => void;
    updateRestLength: (layoutId: Layout["id"], itemId: LayoutItem["id"], restTime: number) => void;
}

const useLayoutGymActions = (id: GymExercise['id']): LayoutGymActionsReturn => {
    const { 
        getGymExercise, 
        restStatus, 
        addSet, 
        removeSet, 
        addDropSet, 
        updateRestLength
    } = useExerciseLayout();
    const { activeRoutine } = useRoutine();
    const { fadeIn } = useFadeInAnim();

    const [restIndex, setRestIndex] = useState<number>(-1);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [columns, setColumns] = useState<(keyof Sets | "set")[]>(["set", "reps", "kg"]); // No "done" column

    const columnOrder: (keyof Sets | "set")[] = ["set", "reps", "kg", "rir", "rpe"]; // No "done" column

    const closeSettings = () => setSettingsVisible(false);
    const openSettings = () => setSettingsVisible(true);

    const layoutId = activeRoutine.layoutId;
    const exercise = getGymExercise(layoutId, id);
    const exId = exercise ? exercise.exId : "";
    const exerciseName = useGetExerciseName(exId);

    const totalSets = exercise?.sets?.length ?? 0;
    const totalDropSets = exercise?.sets?.reduce(
        (sum, set) => sum + (set.dropSets?.length ?? 0),
        0
    ) ?? 0;

    useEffect(() => {
        const base: (keyof Sets | "set")[] = ["set", "reps", "kg"]; // No "done" column
        if (!exercise?.settings.noRIR) base.push("rir");
        if (!exercise?.settings.noRPE) base.push("rpe");
        setColumns(columnOrder.filter(col => base.includes(col)));
    }, [exercise]);

    const heightAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const newHeight = restStatus.id === id ? 0 : totalSets * 44 + totalDropSets * 34 + 1;
        Animated.timing(heightAnim, {
            toValue: newHeight,
            duration: 300,
            useNativeDriver: true
        }).start();
    }, [totalDropSets, totalSets, restStatus.id]);

    return {
        exercise,
        exId,
        layoutId,
        settingsVisible,
        exerciseName,
        closeSettings,
        openSettings,
        columns,
        heightAnim,
        restIndex,
        fadeIn,
        setRestIndex,
        addSet,
        removeSet,
        addDropSet,
        updateRestLength,
    };
};

export default useLayoutGymActions;
