import { storage } from "../CakaAppZustand";
import { CardioExercise, GymExercise, Layout, LayoutItem, SuperSet } from "../ExerciseLayoutZustand";
import { isGymExercise, isSuperSet, findAndUpdate, isCardioExercise, findExercise } from "../utils/GymUtils";

export const createGymSetZustand = (set: any, get: any) => ({
    addRest: (
        layoutId: Layout["id"],
        itemId: LayoutItem["id"],
        setIndex: number,
        restTime: number
    ) => {
        set((state: any) => {
            // Staging-aware: If layout is being edited, update staging version
            if (state.editingSessions && state.editingSessions.has(layoutId)) {
                const newStagingLayouts = new Map(state.stagingLayouts);
                const currentStaging = newStagingLayouts.get(layoutId) as Layout | undefined;
                
                if (currentStaging && currentStaging.layout) {
                    const items = [...currentStaging.layout];
                    
                    // First check if itemId is a superset
                    const supersetIndex = items.findIndex(item => isSuperSet(item) && item.id === itemId);
                    if (supersetIndex !== -1) {
                        const sup = items[supersetIndex] as SuperSet;
                            if (sup.settings.supersetType === 'circuit') {
                            items[supersetIndex] = {
                                    ...sup,
                                    restLength: restTime,
                                    settings: {
                                        ...sup.settings,
                                        noRest: sup.settings.noRest,
                                    },
                                };
                            }
                    } else {
                        // Otherwise find the exercise using findExercise
                        const found = findExercise(items, itemId);
                        if (found) {
                            if (isGymExercise(found.exercise)) {
                                const ge = found.exercise as GymExercise;
                            const originalSets = ge.sets ?? [];
                            const updatedSets = originalSets.map((s, idx) =>
                                idx === setIndex ? { ...s, rest: restTime } : s
                            );
                                found.parent[found.index] = {
                                ...ge,
                                sets: updatedSets,
                            };
                            } else if (isCardioExercise(found.exercise)) {
                                const ce = found.exercise as CardioExercise;
                            const originalIntervals = ce.intervals ?? [];
                            const updatedIntervals = originalIntervals.map((interval, idx) =>
                                idx === setIndex ? { ...interval, rest: restTime } : interval
                            );
                                found.parent[found.index] = {
                                ...ce,
                                intervals: updatedIntervals,
                            };
                            }
                        }
                    }

                    const updatedStaging = {
                        ...currentStaging,
                        layout: items
                    };
                    newStagingLayouts.set(layoutId, updatedStaging);
                    return { stagingLayouts: newStagingLayouts };
                }
            }

            // Otherwise update persisted version directly
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const items = [...layout.layout];
                
                // First check if itemId is a superset
                const supersetIndex = items.findIndex(item => isSuperSet(item) && item.id === itemId);
                if (supersetIndex !== -1) {
                    const sup = items[supersetIndex] as SuperSet;
                        if (sup.settings.supersetType === 'circuit') {
                        items[supersetIndex] = {
                                ...sup,
                                restLength: restTime,
                                settings: {
                                    ...sup.settings,
                                    noRest: sup.settings.noRest,
                                },
                            };
                        }
                } else {
                    // Otherwise find the exercise using findExercise
                    const found = findExercise(items, itemId);
                    if (found) {
                        if (isGymExercise(found.exercise)) {
                            const ge = found.exercise as GymExercise;
                        const originalSets = ge.sets ?? [];
                        const updatedSets = originalSets.map((s, idx) =>
                            idx === setIndex ? { ...s, rest: restTime } : s
                        );
                            found.parent[found.index] = {
                            ...ge,
                            sets: updatedSets,
                        };
                        } else if (isCardioExercise(found.exercise)) {
                            const ce = found.exercise as CardioExercise;
                        const originalIntervals = ce.intervals ?? [];
                        const updatedIntervals = originalIntervals.map((interval, idx) =>
                            idx === setIndex ? { ...interval, rest: restTime } : interval
                        );
                            found.parent[found.index] = {
                            ...ce,
                            intervals: updatedIntervals,
                        };
                        }
                    }
                    }

                return { ...layout, layout: items };
            });
            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },

    startRest: (itemId: LayoutItem["id"], setIndex: number, restTime: number) => {
        set({ restStatus: { id: itemId, index: setIndex }, rest: 0, restTime });
    },

    endRest: (layoutId: Layout["id"]) => {
        set((state: any) => {
            const { rest, layouts, restStatus } = state;
            const setIndex = restStatus.index;
            const restTime = rest;

            // Staging-aware: If layout is being edited, update staging version
            if (state.editingSessions && state.editingSessions.has(layoutId)) {
                const newStagingLayouts = new Map(state.stagingLayouts);
                const currentStaging = newStagingLayouts.get(layoutId) as Layout | undefined;
                
                if (currentStaging && currentStaging.layout) {
                    const items = [...currentStaging.layout];
                    
                    // First check if restStatus.id is a superset
                    const supersetIndex = items.findIndex(item => isSuperSet(item) && item.id === restStatus.id);
                    if (supersetIndex !== -1) {
                        const sup = items[supersetIndex] as SuperSet;
                        if (sup.settings.supersetType === "circuit") {
                            items[supersetIndex] = {
                                ...sup,
                                layout: sup.layout.map(child => {
                                    if (!isGymExercise(child)) return child;

                                    const originalSets = child.sets ?? [];
                                    const updatedSets = originalSets.map((s, idx) =>
                                        idx === setIndex ? { ...s, rest: restTime } : s
                                    );

                                    return { ...child, sets: updatedSets };
                                }),
                            };
                        }
                    } else {
                        // Otherwise find the exercise using findExercise
                        const found = findExercise(items, restStatus.id);
                        if (found) {
                            if (isGymExercise(found.exercise)) {
                                const ge = found.exercise as GymExercise;
                                const originalSets = ge.sets ?? [];
                                const updatedSets = originalSets.map((s, idx) =>
                                    idx === setIndex ? { ...s, rest: restTime } : s
                                );
                                found.parent[found.index] = {
                                    ...ge,
                                    sets: updatedSets,
                                };
                            } else if (isCardioExercise(found.exercise)) {
                                const ce = found.exercise as CardioExercise;
                                const originalIntervals = ce.intervals ?? [];
                                const updatedIntervals = originalIntervals.map((interval, idx) =>
                                    idx === setIndex ? { ...interval, rest: restTime } : interval
                                );
                                found.parent[found.index] = {
                                    ...ce,
                                    intervals: updatedIntervals,
                                };
                            }
                        }
                    }

                    const updatedStaging = {
                        ...currentStaging,
                        layout: items
                    };
                    newStagingLayouts.set(layoutId, updatedStaging);
                    return { 
                        stagingLayouts: newStagingLayouts,
                        restStatus: { id: "stopped", index: -1 }
                    };
                }
            }

            // Otherwise update persisted version directly
            const updatedLayouts = layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const items = [...layout.layout];
                
                // First check if restStatus.id is a superset
                const supersetIndex = items.findIndex(item => isSuperSet(item) && item.id === restStatus.id);
                if (supersetIndex !== -1) {
                    const sup = items[supersetIndex] as SuperSet;
                    if (sup.settings.supersetType === "circuit") {
                        items[supersetIndex] = {
                            ...sup,
                            layout: sup.layout.map(child => {
                                if (!isGymExercise(child)) return child;

                                const originalSets = child.sets ?? [];
                        const updatedSets = originalSets.map((s, idx) =>
                            idx === setIndex ? { ...s, rest: restTime } : s
                        );

                                return { ...child, sets: updatedSets };
                            }),
                        };
                    }
                } else {
                    // Otherwise find the exercise using findExercise
                    const found = findExercise(items, restStatus.id);
                    if (found) {
                        if (isGymExercise(found.exercise)) {
                            const ge = found.exercise as GymExercise;
                            const originalSets = ge.sets ?? [];
                            const updatedSets = originalSets.map((s, idx) =>
                                idx === setIndex ? { ...s, rest: restTime } : s
                            );
                            found.parent[found.index] = {
                                ...ge,
                                sets: updatedSets,
                            };
                        } else if (isCardioExercise(found.exercise)) {
                            const ce = found.exercise as CardioExercise;
                        const originalIntervals = ce.intervals ?? [];
                        const updatedIntervals = originalIntervals.map((interval, idx) =>
                            idx === setIndex ? { ...interval, rest: restTime } : interval
                        );
                            found.parent[found.index] = {
                            ...ce,
                            intervals: updatedIntervals,
                        };
                        }
                    }
                    }

                return { ...layout, layout: items };
            });

            storage?.set("layouts", JSON.stringify(updatedLayouts));

            return {
                layouts: updatedLayouts,
                restStatus: { id: "stopped", index: -1 },
            };
        });
    },

    updateRestTime: (newTime: number) => {
        set({ restTime: newTime });
    },

    tickRest: () => {
        const { rest, restTime } = get();
        set({ rest: rest + 1, restTime: restTime > 0 ? restTime - 1 : 0 });
    },

    updateRestLength: (
        layoutId: Layout["id"],
        itemId: LayoutItem["id"],
        restTime: number
    ) => {
        set((state: any) => {
            // Staging-aware: If layout is being edited, update staging version
            if (state.editingSessions && state.editingSessions.has(layoutId)) {
                const newStagingLayouts = new Map(state.stagingLayouts);
                const currentStaging = newStagingLayouts.get(layoutId) as Layout | undefined;
                
                if (currentStaging && currentStaging.layout) {
                    const newLayoutItems = findAndUpdate(currentStaging.layout, itemId, node => ({
                        ...node,
                        restLength: restTime,
                    }));
                    
                    const updatedStaging = { ...currentStaging, layout: newLayoutItems };
                    newStagingLayouts.set(layoutId, updatedStaging);
                    return { stagingLayouts: newStagingLayouts };
                }
            }

            // Otherwise update persisted version directly (for backward compatibility)
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const newLayout = findAndUpdate(layout.layout, itemId, node => ({
                    ...node,
                    restLength: restTime,
                }));

                return { ...layout, layout: newLayout };
            });

            storage?.set("layouts", JSON.stringify(layouts));
            return { layouts };
        });
    },


    rest: 0,
    restTime: 0,
    restStatus: { id: "stopped", index: -1 },
});