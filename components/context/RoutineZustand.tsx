import { create } from "zustand";
import { useEffect } from "react";
import { defaultRoutine } from "../../constants/Defaults";
import { Layout, useExerciseLayout } from "./ExerciseLayoutZustand";
import { storage } from "./CakaAppZustand";

export type RoutineStatus = "template" | "routine";
export type RoutineType = "gym" | "run" | "walk";

export interface RoutineLayout {
    id: string;
    layoutId: Layout["id"];
    timer?: number;
    lastStartTime?: number;
    startTime?: number;
    endTime?: number;
    status: RoutineStatus;
    type: RoutineType;
    isFinished?: boolean;
    displayName?: string; // Custom display name for finished routines
}

export interface RoutineStoreState {
    routines: RoutineLayout[];
    activeRoutine: RoutineLayout;
    isReady: boolean;
    setReady: (isReady: boolean) => void;
    updateRoutine: (id: RoutineLayout["id"], newRoutine: Partial<RoutineLayout>) => void;
    setActiveRoutine: (id: RoutineLayout["id"]) => void;
    clearActiveRoutine: () => void;
    clearActiveRoutineOnly: () => void;
    cleanupGhostRoutines: () => void;
    loadRoutines: () => void;
    checkAndAddRoutine: (routine: RoutineLayout) => void;
    saveIt: (id: RoutineLayout["id"]) => void;
    saveAsTemplate: (id: RoutineLayout["id"]) => void;
    removeRoutine: (id: RoutineLayout["id"]) => void;

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
            set((state) => {
                // Only clean up the current active routine if it's unfinished
                const { discardStagingLayout, isLayoutBeingEdited, removeLayout, getLayout, savedLayouts } = useExerciseLayout.getState();
                
                // Discard staging changes for the active routine
                if (isLayoutBeingEdited(state.activeRoutine.layoutId)) {
                    discardStagingLayout(state.activeRoutine.layoutId);
                }

                // Only remove layout if it's the current active routine and it's not saved or used elsewhere
                if (state.activeRoutine.status === "template" && !state.activeRoutine.isFinished) {
                    const layout = getLayout(state.activeRoutine.layoutId);
                    if (layout) {
                        // Check if this layout is used by any other routines or is saved
                        const isUsedByOtherRoutines = state.routines.some((r: any) => 
                            r.layoutId === state.activeRoutine.layoutId && 
                            r.id !== state.activeRoutine.id
                        );
                        const isUserSaved = savedLayouts.includes(state.activeRoutine.layoutId);
                        
                        // Only remove if not used elsewhere and not user-saved
                        if (!isUsedByOtherRoutines && !isUserSaved) {
                            removeLayout(state.activeRoutine.layoutId);
                        }
                    }
                }

                // Remove only the current active routine from routines list
                const updatedRoutines = state.routines.filter(routine => routine.id !== state.activeRoutine.id);

                return {
                    activeRoutine: defaultRoutine,
                    routines: updatedRoutines,
                };
            });
        },

        clearActiveRoutineOnly: () => {
            storage?.delete("activeRoutine");
            set({ activeRoutine: defaultRoutine });
        },

        cleanupGhostRoutines: () => {
            const { layouts } = useExerciseLayout.getState();
            set((state) => {
                const validRoutines = state.routines.filter(routine => 
                    layouts.some(layout => layout.id === routine.layoutId)
                );
                
                if (validRoutines.length !== state.routines.length) {
                    console.log('Cleaned up ghost routines:', state.routines.length - validRoutines.length);
                    storage?.set("routines", JSON.stringify(validRoutines));
                    return { routines: validRoutines };
                }
                
                return {};
            });
        },

        saveIt: (id: RoutineLayout["id"]) => {
            set((state: any) => {
                const finishTime = Date.now();
                const date = new Date(finishTime);
                const currentDateString = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                });

                // Generate display name for this routine
                let displayName: string;
                const routineToUpdate = state.routines.find((r: any) => r.id === id);
                if (routineToUpdate) {
                    const { getLayout, commitStagingLayout, isLayoutBeingEdited } = useExerciseLayout.getState();
                    
                    // If layout has staging changes, commit them when workout finishes
                    if (isLayoutBeingEdited(routineToUpdate.layoutId)) {
                        commitStagingLayout(routineToUpdate.layoutId);
                    }
                    
                    const layout = getLayout(routineToUpdate.layoutId);
                    if (layout) {
                        // Use "Workout" as the base name instead of layout name
                        const baseName = "Workout";

                        // Find existing finished routines on the same day with similar base names
                        const sameDayRoutines = state.routines.filter((r: any) =>
                            r.isFinished === true &&
                            r.lastStartTime &&
                            r.displayName &&
                            new Date(r.lastStartTime).toDateString() === date.toDateString() &&
                            r.displayName.startsWith(`${baseName} - ${currentDateString}`)
                        );

                        // Count how many similar routines exist (including this one will be +1)
                        const nextNumber = sameDayRoutines.length + 1;

                        if (nextNumber > 1) {
                            // Same day repeats - add #number
                            displayName = `${baseName} - ${currentDateString} #${nextNumber}`;
                        } else {
                            // First of the day - just date
                            displayName = `${baseName} - ${currentDateString}`;
                        }
                    }
                }

                const updatedRoutines = state.routines.map((r: any) =>
                    r.id === id ? {
                        ...r,
                        status: "routine",
                        isFinished: true,
                        lastStartTime: finishTime,
                        displayName
                    } : r
                );
                storage?.set("routines", JSON.stringify(updatedRoutines));

                const updatedActiveRoutine = updatedRoutines.find((r: any) => r.id === id);
                return {
                    routines: updatedRoutines,
                    activeRoutine: updatedActiveRoutine || state.activeRoutine
                };
            });
        },

        saveAsTemplate: (id: RoutineLayout["id"]) => {
            set((state: any) => {
                const routineToUpdate = state.routines.find((r: any) => r.id === id);
                if (routineToUpdate) {
                    const { commitStagingLayout, isLayoutBeingEdited } = useExerciseLayout.getState();
                    
                    // If layout has staging changes, commit them when saving as template
                    if (isLayoutBeingEdited(routineToUpdate.layoutId)) {
                        commitStagingLayout(routineToUpdate.layoutId);
                    }
                }

                const updatedRoutines = state.routines.map((r: any) =>
                    r.id === id ? { ...r, status: "template", isFinished: false } : r
                );
                storage?.set("routines", JSON.stringify(updatedRoutines));

                const updatedActiveRoutine = updatedRoutines.find((r: any) => r.id === id);
                return {
                    routines: updatedRoutines,
                    activeRoutine: updatedActiveRoutine || state.activeRoutine
                };
            });
        },

        removeRoutine: (id: RoutineLayout["id"]) => {
            set((state: any) => {
                const updatedRoutines = state.routines.filter((r: any) => r.id !== id);
                storage?.set("routines", JSON.stringify(updatedRoutines));

                // If the removed routine was active, clear it
                const wasActive = state.activeRoutine?.id === id;
                return {
                    routines: updatedRoutines,
                    activeRoutine: wasActive ? defaultRoutine : state.activeRoutine
                };
            });
        },


        loadRoutines: () => {
            set({ routines: JSON.parse(storage?.getString("routines") || "[]") });
            // Clean up ghost routines after loading
            setTimeout(() => {
                get().cleanupGhostRoutines();
            }, 100);
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