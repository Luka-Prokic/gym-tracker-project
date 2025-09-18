import { create } from "zustand";
import { useEffect } from "react";
import { Exercise, Sets } from "./ExerciseZustand";
import { createLayoutsZustand } from "./gym/LayoutPartZustand";
import { createGymExercisesZustand } from "./gym/GymExercisePartZustand";
import { createGymSetZustand } from "./gym/RestPartZustand";
import { createGymDropSetZustand } from "./gym/GymDropSetPartZustand";
import { createGymRestZustand } from "./gym/GymSetPartZustand";
import { createSuperSetZustand } from "./gym/SuperSetPartZustand";
import { createLabelsZustand } from "./gym/GymLabelsPartZustand";
import { createCardioExercisesZustand } from "./gym/CardioPartZustand";
import { createCardioIntervalsZustand } from "./gym/CardioIntervalsPartZustand";

export interface GymExerciseSettings {
    noRIR?: boolean;
    noRPE?: boolean;
    noRest: boolean;
    noNote?: boolean;
}

export interface SuperSetSettings {
    supersetType: SuperSetType;
    noRest: boolean;
    noNote?: boolean;
}

export interface CardioSettings {
    noDuration?: boolean;
    noDistance?: boolean;
    noPace?: boolean;
    noSpeed?: boolean;
    noCalories?: boolean;
    noHeartRate?: boolean;
    noSteps?: boolean;
    noCadence?: boolean;
    noElevation?: boolean;
    noIncline?: boolean;
    noResistance?: boolean;
    noIntensity?: boolean;
    noRest?: boolean;
    noLabel?: boolean;
    noNote?: boolean;
    noGPS?: boolean;
    columnOrder: (keyof CardioValues)[] | [];
}


export type ExerciseType = "gym" | "cardio" | "superset";
export type SuperSetType = "default" | "circuit";

export interface GymExercise {
    id: string;
    exId: Exercise["id"];
    sets?: Sets[];
    type?: "gym";
    restLength?: number;
    settings: GymExerciseSettings;
    note?: string;
    prefix?: string;
}

export interface SuperSet {
    id: string;
    layout: LayoutItem[];
    type?: "superset";
    restLength?: number;
    settings: SuperSetSettings;
    note?: string;
    name?: string;
}

export interface CardioExercise {
    id: string;
    exId: Exercise["id"];
    type?: "cardio";
    restLength?: number;
    settings: CardioSettings;
    note?: string;
    prefix?: string;


    session?: CardioSessionSummary;
    intervals?: CardioValues[];
}

export type CardioValues = {
    duration?: number;
    distance?: number;
    intensity?: "low" | "moderate" | "high";
    pace?: number;
    calories?: number;
    heartRate?: number;
    steps?: number;
    cadence?: number;
    elevation?: number;
    incline?: number;
    resistance?: number;
    speed?: number;
    rest?: number;
    label?: string;
};

export interface CardioSessionSummary {
    totalDuration?: number;
    totalDistance?: number;
    avgHeartRate?: number;
    calories?: number;
}

export type LayoutItem = GymExercise | SuperSet | CardioExercise;

export interface Layout {
    id: string;
    name?: string;
    layout: LayoutItem[];
}

type State =
    & ReturnType<typeof createLayoutsZustand>
    & ReturnType<typeof createGymExercisesZustand>
    & ReturnType<typeof createGymSetZustand>
    & ReturnType<typeof createGymDropSetZustand>
    & ReturnType<typeof createGymRestZustand>
    & ReturnType<typeof createSuperSetZustand>
    & ReturnType<typeof createCardioExercisesZustand>
    & ReturnType<typeof createCardioIntervalsZustand>
    & ReturnType<typeof createLabelsZustand>;

export const useExerciseLayout = create<State>((set, get) => ({
    ...createLayoutsZustand(set, get),
    ...createGymExercisesZustand(set, get),
    ...createGymSetZustand(set, get),
    ...createGymDropSetZustand(set, get),
    ...createGymRestZustand(set, get),
    ...createSuperSetZustand(set, get),
    ...createCardioExercisesZustand(set, get),
    ...createCardioIntervalsZustand(set, get),
    ...createLabelsZustand(set, get),
}));



export const useInitializeExerciseLayout = () => {
    const setReady = useExerciseLayout((state: any) => state.setReady);
    useEffect(() => {
        if (typeof window !== "undefined") {
            setReady(true);
        }
    }, [setReady]);
    return {};
};