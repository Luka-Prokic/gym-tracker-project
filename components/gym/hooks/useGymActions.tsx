import { useEffect, useRef, useState } from "react";
import { Exercise, Sets } from "../../context/ExerciseZustand";
import { Layout, useExerciseLayout, GymExercise } from "../../context/ExerciseLayoutZustand";
import { useRoutine } from "../../context/RoutineZustand";
import useGetExerciseName from "./useGetExerciseName";
import { useUser } from "../../context/UserZustend";
import { Animated } from "react-native";
import useFadeInAnim from "@/assets/animations/useFadeInAnim";

interface GymActionsReturn {
    exercise: GymExercise | undefined;
    exId: Exercise["id"];
    layoutId: Layout["id"];
    settingsVisible: boolean;
    exerciseName: string;
    closeSettings: () => void;
    openSettings: () => void;
    columns: (keyof Sets | "set" | "done")[];
    heightAnim: Animated.Value;
    restIndex: number;
    fadeIn: any;
    setRestIndex: React.Dispatch<React.SetStateAction<number>>;
}

const useGymActions = (id: GymExercise['id']): GymActionsReturn => {
    const { getGymExercise, restStatus } = useExerciseLayout();
    const { activeRoutine } = useRoutine();
    const { fadeIn } = useFadeInAnim();

    const [restIndex, setRestIndex] = useState<number>(-1);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [columns, setColumns] = useState<(keyof Sets | "set" | "done")[]>(["set", "reps", "kg", "done"]);

    const columnOrder: (keyof Sets | "set" | "done")[] = ["set", "reps", "kg", "rir", "rpe", "done"];

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
        const base: (keyof Sets | "set" | "done")[] = ["set", "reps", "kg", "done"];
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
    };
};

export default useGymActions;