import { WidgetBlueprint } from "../components/context/CakaAppZustand";
import { DropSets, Exercise, Sets } from "../components/context/ExerciseZustand";
import { CardioSettings, CardioValues, Layout } from "../components/context/ExerciseLayoutZustand";
import { RoutineLayout } from "../components/context/RoutineZustand";
import { UserSettings } from "@/components/context/user/types";

export const defaultWidgetLayout: WidgetBlueprint[] = [
    { id: "11233d", label: "Quick Start", arrow: true, widgetSettings: { resize: true }, mode: "one", key: 1 },
    { id: "12234d", label: "Statistics", widgetSettings: { hidden: true, resize: "two" }, mode: "one", key: 7 },
    { id: "23233d", label: "Session 1", widgetSettings: { hidden: true, rename: true, resize: "two" }, mode: "one", key: 2 },
    { id: "31122d", label: "Monkey", widgetSettings: { hidden: true, rename: true, resize: true }, mode: "one", key: 3 },
    { id: "44233d", label: "Crossfit", widgetSettings: { hidden: true, rename: true, resize: true }, mode: "one", key: 4 },
    { id: "51233d", label: "Ape", widgetSettings: { hidden: true, rename: true, resize: true }, mode: "one", key: 5 },
    { id: "62323d", label: "Blank", widgetSettings: { hidden: true, rename: true, resize: true }, mode: "one", key: 6 },
];

export const defaultWidgets: WidgetBlueprint["id"][] = [
    "11233d",
    "23233d",
    "31122d",
    "44233d",
    "51233d",
    "62323d"
];

export const defaultGymLayout: Layout = {
    id: "gym_111",
    layout: [
        { id: "11s1ea", exId: "111e", sets: [{ reps: 6, kg: 60 }, { reps: 8, kg: 80 }, { reps: 8, kg: 100 }], settings: { noRest: false } },
        { id: "1d22ea", exId: "122e", sets: [{ reps: 8, kg: 70 }, { reps: 10, kg: 80 }, { reps: 10, kg: 90 }], settings: { noRest: false } },
        { id: "13a1ea", exId: "131e", sets: [{ reps: 12, kg: 15 }, { reps: 8, kg: 20 }, { reps: 8, kg: 20 }, { reps: 8, kg: 12.5 }], settings: { noRest: false } },
    ]
};

export const defaultRoutine: RoutineLayout = {
    id: "routine_111",
    layoutId: defaultGymLayout.id,
    timer: 0,
    lastStartTime: Date.now(),
    status: "template",
    type: "gym",
    isFinished: false,
};

export const defaultSet: Sets = { kg: 0, reps: 0, rir: 0, rpe: 1, rest: 0, dropSets: [] };

export const defaultDropSet: DropSets = { kg: 0, reps: 0 };

export const defaultInterval: CardioValues = {
    duration: 0,
    distance: 0,
    intensity: "moderate",
    pace: 0,
    calories: 0,
    heartRate: 0,
    steps: 0,
    cadence: 0,
    elevation: 0,
    incline: 0,
    resistance: 0,
    speed: 0,
    rest: 0,
};

export const defaultCardioColumnOrder: (keyof CardioValues)[] = [
    "duration",
    "distance",
    "speed",
    "intensity",
    "pace",
    "calories",
    "heartRate",
    "steps",
    "cadence",
    "elevation",
    "incline",
    "resistance",
];


export const defaultExercises: Exercise[] = [
    // back – rows & pull-ups
    { id: "w00001", name: "row", equipment: "barbell", bodypart: "back", kind: "gym" },
    { id: "w00002", name: "row", equipment: "machine", bodypart: "back", kind: "gym" },
    { id: "w00003", name: "row", equipment: "dumbbell", bodypart: "back", kind: "gym" },
    { id: "w00004", name: "row", equipment: "cable", bodypart: "back", kind: "gym" },
    { id: "w00005", name: "t-bar row", equipment: "barbell", bodypart: "back", kind: "gym" },
    { id: "w00006", name: "pull-up", equipment: "bodyweight", bodypart: "back", kind: "gym" },
    { id: "w00007", name: "chin-up", equipment: "bodyweight", bodypart: "back", kind: "gym" },

    // lats – pulldowns
    { id: "w00008", name: "lat pulldown", equipment: "machine", bodypart: "back", kind: "gym" },
    { id: "w00009", name: "lat pulldown", equipment: "cable", bodypart: "back", kind: "gym" },

    // biceps
    { id: "w00010", name: "biceps curls", equipment: "dumbbell", bodypart: "biceps", kind: "gym" },
    { id: "w00011", name: "biceps curls", equipment: "barbell", bodypart: "biceps", kind: "gym" },
    { id: "w00012", name: "biceps curls", equipment: "cable", bodypart: "biceps", kind: "gym" },
    { id: "w00013", name: "preacher curl", equipment: "machine", bodypart: "biceps", kind: "gym" },
    { id: "w00014", name: "hammer curl", equipment: "dumbbell", bodypart: "biceps", kind: "gym" },

    // chest – presses
    { id: "w00015", name: "bench press", equipment: "dumbbell", bodypart: "chest", kind: "gym" },
    { id: "w00016", name: "bench press", equipment: "barbell", bodypart: "chest", kind: "gym" },
    { id: "w00017", name: "incline bench press", equipment: "dumbbell", bodypart: "chest", kind: "gym" },
    { id: "w00018", name: "incline bench press", equipment: "barbell", bodypart: "chest", kind: "gym" },

    // chest – machines & flyes
    { id: "w00019", name: "chest press", equipment: "machine", bodypart: "chest", kind: "gym" },
    { id: "w00020", name: "chest press", equipment: "cable", bodypart: "chest", kind: "gym" },
    { id: "w00021", name: "chest fly", equipment: "cable", bodypart: "chest", kind: "gym" },
    { id: "w00022", name: "pec deck", equipment: "machine", bodypart: "chest", kind: "gym" },
    { id: "w00023", name: "chest crossover", equipment: "cable", bodypart: "chest", kind: "gym" },
    { id: "w00024", name: "push-up", equipment: "bodyweight", bodypart: "chest", kind: "gym" },

    // deadlifts
    { id: "w00025", name: "romanian deadlift", equipment: "dumbbell", bodypart: "back", kind: "gym" },
    { id: "w00026", name: "romanian deadlift", equipment: "barbell", bodypart: "back", kind: "gym" },
    { id: "w00027", name: "stiff leg deadlift", equipment: "dumbbell", bodypart: "back", kind: "gym" },
    { id: "w00028", name: "stiff leg deadlift", equipment: "barbell", bodypart: "back", kind: "gym" },
    { id: "w00029", name: "deadlift", equipment: "barbell", bodypart: "back", kind: "gym" },
    { id: "w00030", name: "deadlift", equipment: "dumbbell", bodypart: "back", kind: "gym" },
    { id: "w00031", name: "deadlift", equipment: "axel bar", bodypart: "back", kind: "gym" },
    { id: "w00032", name: "sumo deadlift", equipment: "barbell", bodypart: "back", kind: "gym" },

    // legs – squats & presses
    { id: "w00033", name: "back squat", equipment: "barbell", bodypart: "legs", kind: "gym" },
    { id: "w00034", name: "front squat", equipment: "barbell", bodypart: "legs", kind: "gym" },
    { id: "w00035", name: "goblet squat", equipment: "dumbbell", bodypart: "legs", kind: "gym" },
    { id: "w00036", name: "leg press", equipment: "machine", bodypart: "legs", kind: "gym" },

    // legs – isolation
    { id: "w00037", name: "leg extension", equipment: "machine", bodypart: "legs", kind: "gym" },
    { id: "w00038", name: "leg curl", equipment: "machine", bodypart: "legs", kind: "gym" },
    { id: "w00039", name: "calf raise", equipment: "machine", bodypart: "calves", kind: "gym" },

    // glutes
    { id: "w00040", name: "hip thrust", equipment: "barbell", bodypart: "glutes", kind: "gym" },
    { id: "w00041", name: "glute bridge", equipment: "bodyweight", bodypart: "glutes", kind: "gym" },
    { id: "w00042", name: "kickback", equipment: "cable", bodypart: "glutes", kind: "gym" },

    // shoulders
    { id: "w00043", name: "shoulder press", equipment: "dumbbell", bodypart: "shoulders", kind: "gym" },
    { id: "w00044", name: "shoulder press", equipment: "barbell", bodypart: "shoulders", kind: "gym" },
    { id: "w00045", name: "shoulder press", equipment: "machine", bodypart: "shoulders", kind: "gym" },
    { id: "w00046", name: "lateral raise", equipment: "machine", bodypart: "shoulders", kind: "gym" },
    { id: "w00047", name: "lateral raise", equipment: "dumbbell", bodypart: "shoulders", kind: "gym" },
    { id: "w00048", name: "lateral raise", equipment: "cable", bodypart: "shoulders", kind: "gym" },
    { id: "w00049", name: "rear delt fly", equipment: "machine", bodypart: "shoulders", kind: "gym" },
    { id: "w00050", name: "rear delt fly", equipment: "dumbbell", bodypart: "shoulders", kind: "gym" },
    { id: "w00051", name: "rear delt fly", equipment: "cable", bodypart: "shoulders", kind: "gym" },

    // triceps
    { id: "w00052", name: "triceps pushdown", equipment: "cable", bodypart: "triceps", kind: "gym" },
    { id: "w00053", name: "overhead triceps extension", equipment: "dumbbell", bodypart: "triceps", kind: "gym" },
    { id: "w00054", name: "triceps dips", equipment: "bodyweight", bodypart: "triceps", kind: "gym" },
    { id: "w00055", name: "skull crusher", equipment: "barbell", bodypart: "triceps", kind: "gym" },

    // core
    { id: "w00056", name: "plank", equipment: "bodyweight", bodypart: "core", kind: "gym" },
    { id: "w00057", name: "russian twist", equipment: "dumbbell", bodypart: "core", kind: "gym" },
    { id: "w00058", name: "hanging leg raise", equipment: "bodyweight", bodypart: "core", kind: "gym" },
    { id: "w00059", name: "mountain climber", equipment: "bodyweight", bodypart: "core", kind: "gym" },

    // calves
    { id: "w00060", name: "standing calf raise", equipment: "bodyweight", bodypart: "calves", kind: "gym" },
    { id: "w00061", name: "seated calf raise", equipment: "machine", bodypart: "calves", kind: "gym" },
    { id: "w00062", name: "donkey calf raise", equipment: "bodyweight", bodypart: "calves", kind: "gym" },

    // forearms
    { id: "w00063", name: "wrist curl", equipment: "barbell", bodypart: "forearms", kind: "gym" },
    { id: "w00064", name: "wrist curl", equipment: "dumbbell", bodypart: "forearms", kind: "gym" },
    { id: "w00065", name: "wrist curl", equipment: "axel bar", bodypart: "forearms", kind: "gym" },
    { id: "w00066", name: "reverse wrist curl", equipment: "dumbbell", bodypart: "forearms", kind: "gym" },

    // full
    { id: "w00069", name: "burpee", equipment: "bodyweight", bodypart: "full", kind: "gym" },
    { id: "w00070", name: "jumping jack", equipment: "bodyweight", bodypart: "full", kind: "gym" },

    // cardio
    // { id: "w00067", name: "farmers carry", equipment: "dumbbell", bodypart: ["full", "forearms"], kind: "cardio" },
    // { id: "w00068", name: "farmers carry", equipment: "other", bodypart: ["full", "forearms"], kind: "cardio" },
    // { id: "c00001", name: "Run", equipment: "treadmill", bodypart: "legs", kind: "cardio" },
    // { id: "c00002", name: "Cycling", equipment: "bike", bodypart: "legs", kind: "cardio" },
    // { id: "c00003", name: "Cycling", equipment: "elliptical", bodypart: "legs", kind: "cardio" },
    // { id: "c00004", name: "Row", equipment: "rower", bodypart: "back", kind: "cardio" },
    // { id: "c00005", name: "Stair Climb", equipment: "stairmaster", bodypart: ["lower"], kind: "cardio" },
    // { id: "c00015", name: "Stair Climb", equipment: "bodyweight", bodypart: ["lower"], kind: "cardio" },
    // { id: "c00006", name: "Jump Rope", equipment: "bodyweight", bodypart: ["core", "legs"], kind: "cardio" },
    // { id: "c00007", name: "Battle Ropes", equipment: "machine", bodypart: ["upper", "core"], kind: "cardio" },
    // { id: "c00008", name: "Shadow Boxing", equipment: "bodyweight", bodypart: ["core", "upper"], kind: "cardio" },
    // { id: "c00009", name: "HIIT Circuit", equipment: "bodyweight", bodypart: "full", kind: "cardio" },
];

export const cardioEquipmentSettings: Record<string, Partial<CardioSettings>> = {
    treadmill: {
        noDistance: false,
        noSpeed: false,
        noPace: false,
        noIncline: false,
    },
    bike: {
        noDistance: false,
        noCadence: false,
    },
    rower: {
        noResistance: false,
        noPace: false,
    },
    stairmaster: {
        noElevation: false,
    },
    bodyweight: {
        noSteps: false,
        noCadence: false,
    },
    elliptical: {
        noSpeed: false,
        noPace: false,
        noCadence: false,
    },
    machine: {
        noSpeed: false,
    },
};

export const defaultSettings: UserSettings = {
    gym: {
        showRIR: false,
        showRPE: false,
        showPreviousStats: false,
    },
    cardio: {
        showCalories: false,
        showHeartRate: false,
        showExercises: false,
    },
    units: {
        weight: 'kg',
        distance: 'km',
        pace: 'min/km',
        elevation: 'm',
        temperature: 'C',
        energy: 'kcal',
    },
    defaultRestLength: 120,
    autoRest: false,
};
