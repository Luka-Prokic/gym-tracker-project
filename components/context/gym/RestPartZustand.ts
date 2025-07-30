import { storage } from "../CakaAppZustand";
import { CardioExercise, GymExercise, Layout, LayoutItem, SuperSet } from "../ExerciseLayoutZustand";
import { isGymExercise, isSuperSet, findAndUpdate, isCardioExercise } from "../utils/GymUtils";

export const createGymSetZustand = (set: any, get: any) => ({
    addRest: (
        layoutId: Layout["id"],
        itemId: LayoutItem["id"],
        setIndex: number,
        restTime: number
    ) => {
        set((state: any) => {
            const layouts = state.layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const newLayout = findAndUpdate(layout.layout, itemId, node => {
                    if (isSuperSet(node)) {
                        const sup = node as SuperSet;
                        if (sup.settings.supersetType === 'circuit') {
                            return {
                                ...sup,
                                restLength: restTime,
                                settings: {
                                    ...sup.settings,
                                    noRest: sup.settings.noRest,
                                },
                            };
                        }
                        return sup;
                    }

                    if (isGymExercise(node)) {
                        const ge = node as GymExercise;
                        const originalSets = ge.sets ?? [];
                        const updatedSets = originalSets.map((s, idx) =>
                            idx === setIndex ? { ...s, rest: restTime } : s
                        );
                        return {
                            ...ge,
                            sets: updatedSets,
                        };
                    }

                    if (isCardioExercise(node)) {
                        const ce = node as CardioExercise;
                        const originalIntervals = ce.intervals ?? [];
                        const updatedIntervals = originalIntervals.map((interval, idx) =>
                            idx === setIndex ? { ...interval, rest: restTime } : interval
                        );
                        return {
                            ...ce,
                            intervals: updatedIntervals,
                        };
                    }

                    return node;
                });

                return { ...layout, layout: newLayout };
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

            const updatedLayouts = layouts.map((layout: Layout) => {
                if (layout.id !== layoutId) return layout;

                const newLayout = findAndUpdate(layout.layout, restStatus.id, node => {
                    if (isSuperSet(node)) {
                        const sup = node as SuperSet;

                        if (sup.settings.supersetType === "circuit") {
                            return {
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

                        return sup;
                    }

                    if (isGymExercise(node)) {
                        const ge = node as GymExercise;
                        const originalSets = ge.sets ?? [];
                        const updatedSets = originalSets.map((s, idx) =>
                            idx === setIndex ? { ...s, rest: restTime } : s
                        );

                        return {
                            ...ge,
                            sets: updatedSets,
                        };
                    }

                    if (isCardioExercise(node)) {
                        const ce = node as CardioExercise;
                        const originalIntervals = ce.intervals ?? [];
                        const updatedIntervals = originalIntervals.map((interval, idx) =>
                            idx === setIndex ? { ...interval, rest: restTime } : interval
                        );
                        return {
                            ...ce,
                            intervals: updatedIntervals,
                        };
                    }

                    return node;
                });

                return { ...layout, layout: newLayout };
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