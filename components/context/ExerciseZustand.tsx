import { create } from "zustand";
import { useEffect } from "react";
import { defaultExercises } from "../../constants/Defaults";

export type rpeType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type rirType = 0 | 1 | 2 | 3 | 4 | 5 | "6+";
export type EquipmentType =
    | "cable"
    | "barbell"
    | "dumbbell"
    | "machine"
    | "kettlebell"
    | "log"
    | "axel bar"
    | "plate"
    | "bodyweight"
    // | "treadmill"
    // | "bike"
    // | "elliptical"
    // | "rower"
    // | "stairmaster"
    | "other";

export const EQUIPMENT_LIST: EquipmentType[] = [
    "cable",
    "barbell",
    "dumbbell",
    "machine",
    "kettlebell",
    "log",
    "axel bar",
    "plate",
    "bodyweight",
    // "treadmill",
    // "bike",
    // "elliptical",
    // "rower",
    // "stairmaster",
    "other",
];

export type BodypartType =
    | "back"
    | "biceps"
    | "chest"
    | "legs"
    | "shoulders"
    | "triceps"
    | "core"
    | "calves"
    | "glutes"
    | "forearms"
    | "upper"
    | "lower"
    | "full"
    | "other";

export const BODYPART_LIST: BodypartType[] = [
    "back",
    "biceps",
    "chest",
    "legs",
    "glutes",
    "shoulders",
    "triceps",
    "core",
    "calves",
    "forearms",
    "upper",
    "lower",
    "full",
    "other",
];




export type ExerciseKind = "gym" | "cardio";

export interface Exercise {
    id: string;
    name: string;
    equipment: EquipmentType;
    bodypart: BodypartType | BodypartType[];
    kind: ExerciseKind;
    description?: string;
    tags?: string[];
}

export interface Sets {
    reps?: number;
    kg?: number;
    rir?: rirType;
    rpe?: rpeType;
    rest?: number;
    dropSets?: DropSets[];
}

export interface DropSets {
    reps?: number;
    kg?: number;
}

export interface ExerciseState {
    exercises: Exercise[];
    isReady: boolean;
    setReady: (isReady: boolean) => void;
    getExercise: (id: Exercise["id"]) => Exercise | undefined;
    addEquipment: (equipment: string) => void;
}

export const useExercise = create<ExerciseState>((set, get) => {
    return {
        exercises: defaultExercises,
        //     JSON.parse(
        //         storage?.getString("exercises") 
        //         ||
        //         JSON.stringify([defaultExercises])
        //     )
        // ,
        isReady: false,

        setReady: (isReady: boolean) => set({ isReady }),

        getExercise: (id: Exercise["id"]) => {
            return get().exercises.find((exercise) => exercise.id === id);
        },

        addEquipment: (equipment: string) => {
        },
    };
});

export const useInitializeExercise = () => {
    const setReady = useExercise((state) => state.setReady);
    useEffect(() => {
        if (typeof window !== "undefined") {
            setReady(true);
        }
    }, [setReady]);
    return {};
};