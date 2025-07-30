import { create } from "zustand";
import { useEffect } from "react";
import { defaultRoutine } from "../../constants/Defaults";
import { Layout, useExerciseLayout } from "./ExerciseLayoutZustand";
import { storage } from "./CakaAppZustand";

export type RoutineStatus = "saved" | "temp";
export type RoutineType = "gym" | "run" | "walk";

export interface RoutineLayout {
    id: string;
    layoutId: Layout["id"];
    timer?: number;
    lastStartTime?: number;
    status: RoutineStatus;
    type: RoutineType;
}

export interface RoutineStoreState {
    routines: RoutineLayout[];
    activeRoutine: RoutineLayout;
    isReady: boolean;
    setReady: (isReady: boolean) => void;
    updateRoutine: (id: RoutineLayout["id"], newRoutine: Partial<RoutineLayout>) => void;
    setActiveRoutine: (id: RoutineLayout["id"]) => void;
    clearActiveRoutine: () => void;
    loadRoutines: () => void;
    checkAndAddRoutine: (routine: RoutineLayout) => void;
    saveIt: (id: RoutineLayout["id"]) => void;

    time: number;
    timerStatus: "running" | "paused" | "stopped";
    startTimer: () => void;
    pauseTimer: () => void;
    resetTimer: () => void;
}

export const useRoutine = create<RoutineStoreState>((set, get) => {
    let intervalId: NodeJS.Timeout | null = null;
    return {
        routines: JSON.parse(
            storage?.getString("routines") ||
            "[]"
        ),
        activeRoutine: JSON.parse(
            storage?.getString("activeRoutine") ||
            JSON.stringify(defaultRoutine)),
        isReady: false,

        setReady: (isReady: boolean) => set({ isReady }),

        updateRoutine: (id, newRoutine) =>
            set((state) => {
                const updatedRoutines = state.routines.map((routine) =>
                    routine.id === id ? { ...routine, ...newRoutine } : routine
                );
                let updatedActiveRoutine = state.activeRoutine;
                if (state.activeRoutine && state.activeRoutine.id === id) {
                    updatedActiveRoutine = { ...state.activeRoutine, ...newRoutine };
                }
                storage?.set("routines", JSON.stringify(updatedRoutines));
                return { routines: updatedRoutines, activeRoutine: updatedActiveRoutine };
            }),

        setActiveRoutine: (id: RoutineLayout["id"]) => {
            const routine = get().routines.find(r => r.id === id);
            if (routine) {
                storage?.set("activeRoutine", JSON.stringify(routine));
                set({ activeRoutine: routine });
            }
        },

        clearActiveRoutine: () => {
            storage?.delete("activeRoutine");
            set((state) => ({
                activeRoutine: defaultRoutine,
                routines: state.routines.filter(routine => routine.status !== "temp"),
            }));
        },

        saveIt: (id: RoutineLayout["id"]) => {
            set((state: any) => {
                const updatedRoutines = state.routines.map((r: any) =>
                    r.id === id ? { ...r, status: "saved" } : r
                );
                storage?.set("routines", JSON.stringify(updatedRoutines));
                return { routines: updatedRoutines };
            });

            const updatedActiveRoutine = get().routines.find(r => r.id === id);
            if (updatedActiveRoutine) {
                set({ activeRoutine: updatedActiveRoutine });
            }
        },

        loadRoutines: () => {
            set({ routines: JSON.parse(storage?.getString("routines") || "[]") });
        },

        checkAndAddRoutine: (routine: RoutineLayout) =>
            set((state) => {
                const existingRoutineIndex = state.routines.findIndex(r => r.id === routine.id);
                let updatedRoutines;
                if (existingRoutineIndex !== -1) {
                    updatedRoutines = state.routines.map((r) =>
                        r.id === routine.id ? { ...r, ...routine } : r
                    );
                } else {
                    updatedRoutines = [...state.routines, routine];
                }
                storage?.set("routines", JSON.stringify(updatedRoutines));
                return { routines: updatedRoutines };
            }),

        startTimer: () => {
            if (intervalId) return;
            set({ timerStatus: "running" });
            intervalId = setInterval(() => {
                const { tickRest, restStatus } = useExerciseLayout.getState();
                if (restStatus.id !== "stopped")
                    tickRest();

                const { time, activeRoutine, updateRoutine } = get();
                updateRoutine(activeRoutine.id, { timer: time + 1 });
                set({ time: time + 1, timerStatus: "running" });

                if (activeRoutine === defaultRoutine) {
                    clearInterval(intervalId!);
                    intervalId = null;
                    set({ time: 0, timerStatus: "paused" });
                    return;
                }
            }, 1000);
        },
        pauseTimer: () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
                set({ timerStatus: "paused" });
            }
        },
        resetTimer: () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            set({ time: 0, timerStatus: "paused" });
        },

        time: 0,
        timerStatus: "paused",
    };
});

export const useInitializeRoutine = () => {
    const setReady = useRoutine((state) => state.setReady);
    useEffect(() => {
        if (typeof window !== "undefined") {
            setReady(true);
        }
    }, [setReady]);
    return {};
};